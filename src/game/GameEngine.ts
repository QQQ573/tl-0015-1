import type {
  Fortune,
  Zodiac,
  GameEvent,
  Ending,
  MapNode,
  EndingType,
  EventType,
  InventoryItem,
  ActiveItemEffect,
  Shop,
  ShopItem,
  Item,
  ItemEffectType,
  FortuneKey,
} from './types';
import {
  ZODIACS,
  EVENTS,
  ENDING_TEXTS,
  INITIAL_FORTUNE,
  NODE_COUNT,
  FORTUNE_KEYS,
  ITEMS,
  SHOP_COUNT,
  INVENTORY_SIZE,
  FORTUNE_LABELS_FULL,
} from './constants';
import { SeededRandom } from './SeededRandom';

const RARITY_WEIGHTS: Record<string, number> = {
  common: 60,
  uncommon: 30,
  rare: 10,
};

const TYPE_TARGET: Record<EventType, number> = {
  redPacket: 2,
  quarrel: 2,
  noble: 2,
  loseMoney: 2,
  neutral: 4,
};

export class GameEngine {
  private rng: SeededRandom;
  private zodiac: Zodiac;
  private fortune: Fortune;
  private currentNodeIndex: number;
  private nodes: MapNode[];
  private currentEvent: GameEvent | null = null;
  private currentShop: Shop | null = null;
  private ending: Ending | null = null;
  private steps: number = 0;
  private inventory: InventoryItem[] = [];
  private activeEffects: ActiveItemEffect[] = [];
  private shops: Shop[] = [];
  private sessionSpent: number = 0;

  constructor(zodiacId: string, seed: string) {
    const zodiac = ZODIACS.find((z) => z.id === zodiacId);
    if (!zodiac) {
      throw new Error(`Zodiac not found: ${zodiacId}`);
    }

    this.zodiac = zodiac;
    this.rng = new SeededRandom(`temple-fair:${seed}:${zodiacId}`);
    this.fortune = this.calculateInitialFortune();
    this.shops = this.generateShops();
    this.nodes = this.generateNodes();
  }

  private calculateInitialFortune(): Fortune {
    const fortune: Fortune = { ...INITIAL_FORTUNE };
    const bonus = this.zodiac.bonus;

    for (const key of FORTUNE_KEYS) {
      if (bonus[key] !== undefined) {
        fortune[key] = Math.min(100, Math.max(0, fortune[key] + (bonus[key] as number)));
      }
    }

    return fortune;
  }

  private generateShops(): Shop[] {
    const shops: Shop[] = [];
    const allIndices = Array.from({ length: NODE_COUNT }, (_, i) => i);
    const shuffledIndices = this.rng.shuffle(allIndices);
    const shopIndices = shuffledIndices.slice(0, SHOP_COUNT).sort((a, b) => a - b);

    for (let i = 0; i < SHOP_COUNT; i++) {
      const nodeIndex = shopIndices[i];
      const shopItems = this.generateShopItems(i);
      shops.push({
        nodeIndex,
        items: shopItems,
        visited: false,
      });
    }

    return shops;
  }

  private generateShopItems(shopIndex: number): ShopItem[] {
    const shopRng = new SeededRandom(`temple-fair-shop:${this.rng.getSeed()}:${shopIndex}`);
    const shopItems: ShopItem[] = [];
    const shuffledItems = shopRng.shuffle([...ITEMS]);
    const selectedItems = shuffledItems.slice(0, 6);

    for (const item of selectedItems) {
      const price = item.basePrice + shopRng.nextInt(-item.priceVariance, item.priceVariance);
      const maxStock = item.maxStack > 1 ? shopRng.nextInt(1, Math.min(3, item.maxStack)) : 1;
      shopItems.push({
        itemId: item.id,
        price: Math.max(5, price),
        stock: maxStock,
        maxStock,
      });
    }

    return shopItems;
  }

  private generateNodes(): MapNode[] {
    const nodes: MapNode[] = [];
    const shopNodeIndices = new Set(this.shops.map((s) => s.nodeIndex));
    const eventCount = NODE_COUNT - SHOP_COUNT;
    const availableEvents = this.getFilteredEvents();

    if (availableEvents.length < eventCount) {
      console.warn(
        `可用事件数(${availableEvents.length})少于事件节点数(${eventCount})，可能会有重复`
      );
    }

    const selectedEvents = this.selectUniqueEvents(availableEvents, eventCount);
    const shuffledEvents = this.rng.shuffle(selectedEvents);

    let eventIdx = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      if (shopNodeIndices.has(i)) {
        const shop = this.shops.find((s) => s.nodeIndex === i)!;
        nodes.push({
          index: i,
          type: 'shop',
          shopId: `shop_${i}`,
          visited: false,
        });
      } else {
        const event = shuffledEvents[eventIdx];
        nodes.push({
          index: i,
          type: 'event',
          eventId: event?.id,
          visited: false,
        });
        eventIdx++;
      }
    }

    return nodes;
  }

  private getFilteredEvents(): GameEvent[] {
    const zodiacEvents: GameEvent[] = [];
    const commonEvents: GameEvent[] = [];

    for (const event of EVENTS) {
      if (event.zodiacExclusive && event.zodiacExclusive.length > 0) {
        if (event.zodiacExclusive.includes(this.zodiac.id)) {
          zodiacEvents.push(event);
        }
      } else {
        commonEvents.push(event);
      }
    }

    return [...zodiacEvents, ...commonEvents];
  }

  private selectUniqueEvents(pool: GameEvent[], count: number): GameEvent[] {
    const selected: GameEvent[] = [];
    const usedIds = new Set<string>();

    const zodiacSpecial = pool.filter((e) => e.zodiacExclusive?.includes(this.zodiac.id));
    const hasSpecialInFirstHalf = zodiacSpecial.length > 0 && this.rng.next() < 0.85;

    if (hasSpecialInFirstHalf) {
      const special = this.pickWeighted(zodiacSpecial);
      selected.push(special);
      usedIds.add(special.id);
    }

    const typeCounts: Record<string, number> = {};
    for (const type of Object.keys(TYPE_TARGET)) {
      typeCounts[type] = 0;
    }

    for (const event of selected) {
      typeCounts[event.type]++;
    }

    const remainingCount = count - selected.length;
    const remainingPool = pool.filter((e) => !usedIds.has(e.id));

    for (let i = 0; i < remainingCount && remainingPool.length > 0; i++) {
      const underrepresentedTypes = Object.entries(typeCounts)
        .filter(([type, num]) => {
          const target = TYPE_TARGET[type as EventType] ?? 2;
          return num < target;
        })
        .map(([type]) => type);

      let candidates: GameEvent[];

      if (underrepresentedTypes.length > 0) {
        candidates = remainingPool.filter(
          (e) => underrepresentedTypes.includes(e.type) && !usedIds.has(e.id)
        );
      }

      if (!candidates || candidates.length === 0) {
        candidates = remainingPool.filter((e) => !usedIds.has(e.id));
      }

      if (candidates.length === 0) {
        break;
      }

      const chosen = this.pickWeighted(candidates);
      selected.push(chosen);
      usedIds.add(chosen.id);
      typeCounts[chosen.type] = (typeCounts[chosen.type] || 0) + 1;

      const idx = remainingPool.findIndex((e) => e.id === chosen.id);
      if (idx > -1) {
        remainingPool.splice(idx, 1);
      }
    }

    if (selected.length < count) {
      const backup = pool.filter((e) => !usedIds.has(e.id));
      const shuffledBackup = this.rng.shuffle(backup);
      for (const event of shuffledBackup) {
        if (selected.length >= count) break;
        selected.push(event);
        usedIds.add(event.id);
      }
    }

    return selected.slice(0, count);
  }

  private pickWeighted(events: GameEvent[]): GameEvent {
    if (events.length === 0) {
      throw new Error('Cannot pick from empty array');
    }

    const totalWeight = events.reduce((sum, event) => {
      const rarity = event.rarity || 'common';
      return sum + (RARITY_WEIGHTS[rarity] ?? 50);
    }, 0);

    let random = this.rng.next() * totalWeight;

    for (const event of events) {
      const rarity = event.rarity || 'common';
      const weight = RARITY_WEIGHTS[rarity] ?? 50;
      random -= weight;
      if (random <= 0) {
        return event;
      }
    }

    return events[events.length - 1];
  }

  getFortune(): Fortune {
    return { ...this.fortune };
  }

  getZodiac(): Zodiac {
    return { ...this.zodiac };
  }

  getCurrentNodeIndex(): number {
    return this.currentNodeIndex;
  }

  getNodes(): MapNode[] {
    return this.nodes.map((n) => ({ ...n }));
  }

  getCurrentEvent(): GameEvent | null {
    return this.currentEvent ? { ...this.currentEvent } : null;
  }

  getEnding(): Ending | null {
    return this.ending ? { ...this.ending } : null;
  }

  getSteps(): number {
    return this.steps;
  }

  canMoveForward(): boolean {
    return (
      this.currentNodeIndex < NODE_COUNT - 1 &&
      this.ending === null &&
      this.currentEvent === null &&
      this.currentShop === null
    );
  }

  moveForward(): { type: 'event'; event: GameEvent } | { type: 'shop'; shop: Shop } | null {
    if (!this.canMoveForward()) {
      return null;
    }

    this.currentNodeIndex++;
    this.steps++;

    const node = this.nodes[this.currentNodeIndex];
    node.visited = true;

    if (node.type === 'shop') {
      const shop = this.shops.find((s) => s.nodeIndex === this.currentNodeIndex);
      if (!shop) {
        throw new Error(`Shop not found at node ${this.currentNodeIndex}`);
      }
      shop.visited = true;
      this.currentShop = shop;
      this.clearActiveEffects();
      return { type: 'shop', shop: { ...shop, items: shop.items.map((i) => ({ ...i })) } };
    } else {
      const event = EVENTS.find((e) => e.id === node.eventId);
      if (!event) {
        throw new Error(`Event not found: ${node.eventId}`);
      }
      this.currentEvent = event;
      this.clearActiveEffects();
      return { type: 'event', event: { ...event } };
    }
  }

  makeChoice(choiceIndex: number): { resultText: string; ending: Ending | null; droppedItem?: string } {
    if (!this.currentEvent) {
      throw new Error('No current event');
    }

    const choice = this.currentEvent.choices[choiceIndex];
    if (!choice) {
      throw new Error(`Invalid choice index: ${choiceIndex}`);
    }

    const modifiedEffect = this.applyActiveEffects(choice.effect);
    this.applyEffect(modifiedEffect);
    const ending = this.checkEnding();

    this.currentEvent = null;
    this.clearActiveEffects();

    let droppedItem: string | undefined;
    if (!ending && this.rng.next() < 0.15) {
      droppedItem = this.tryDropItem();
    }

    if (ending) {
      this.ending = ending;
    } else if (this.currentNodeIndex >= NODE_COUNT - 1) {
      this.ending = this.createPeacefulEnding();
    }

    return {
      resultText: choice.resultText,
      ending: this.ending ? { ...this.ending } : null,
      droppedItem,
    };
  }

  private applyActiveEffects(baseEffect: Partial<Fortune>): Partial<Fortune> {
    const modified: Partial<Fortune> = { ...baseEffect };

    for (const effect of this.activeEffects) {
      if (effect.used) continue;

      switch (effect.effectType) {
        case 'amulet':
          for (const key of FORTUNE_KEYS) {
            const val = modified[key];
            if (val !== undefined && val < 0) {
              modified[key] = Math.floor(val / 2);
            }
          }
          effect.used = true;
          break;

        case 'candied_haw':
          const bonus = effect.effectValue || 3;
          for (const key of FORTUNE_KEYS) {
            const val = modified[key];
            if (val !== undefined && val > 0) {
              modified[key] = val + bonus;
            }
          }
          effect.used = true;
          break;

        case 'couplet':
          for (const key of FORTUNE_KEYS) {
            const val = modified[key];
            if (val !== undefined && val < 0) {
              modified[key] = 0;
            }
          }
          effect.used = true;
          break;

        case 'firecracker':
          for (const key of FORTUNE_KEYS) {
            const val = modified[key];
            if (val !== undefined && val < 0) {
              modified[key] = 0;
            }
          }
          effect.used = true;
          break;

        case 'fan':
          const fanBonus = effect.effectValue || 2;
          for (const key of FORTUNE_KEYS) {
            const val = modified[key];
            if (val !== undefined && val !== 0) {
              modified[key] = val > 0 ? val + fanBonus : val - fanBonus;
            }
          }
          effect.used = true;
          break;
      }
    }

    return modified;
  }

  private applyEffect(effect: Partial<Fortune>): void {
    for (const key of FORTUNE_KEYS) {
      const value = effect[key];
      if (value !== undefined) {
        this.fortune[key] = Math.min(100, Math.max(0, this.fortune[key] + value));
      }
    }
  }

  private checkEnding(): Ending | null {
    for (const key of FORTUNE_KEYS) {
      const value = this.fortune[key];
      if (value >= 100) {
        return this.createEnding(`${key}_peak` as EndingType);
      }
      if (value <= 0) {
        return this.createEnding(`${key}_valley` as EndingType);
      }
    }
    return null;
  }

  private createEnding(type: EndingType): Ending {
    const text = ENDING_TEXTS[type];
    return {
      type,
      title: text.title,
      description: text.description,
      fortune: { ...this.fortune },
    };
  }

  private createPeacefulEnding(): Ending {
    return this.createEnding('peaceful');
  }

  getEventById(id: string): GameEvent | undefined {
    return EVENTS.find((e) => e.id === id);
  }

  static generateRandomSeed(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  static getAllZodiacs(): Zodiac[] {
    return ZODIACS.map((z) => ({ ...z }));
  }

  static getZodiacById(id: string): Zodiac | undefined {
    return ZODIACS.find((z) => z.id === id);
  }

  getInventory(): InventoryItem[] {
    return this.inventory.map((i) => ({ ...i }));
  }

  getActiveEffects(): ActiveItemEffect[] {
    return this.activeEffects.map((e) => ({ ...e }));
  }

  getShops(): Shop[] {
    return this.shops.map((s) => ({
      ...s,
      items: s.items.map((i) => ({ ...i })),
    }));
  }

  getCurrentShop(): Shop | null {
    return this.currentShop
      ? {
          ...this.currentShop,
          items: this.currentShop.items.map((i) => ({ ...i })),
        }
      : null;
  }

  getSessionSpent(): number {
    return this.sessionSpent;
  }

  getItemById(itemId: string): Item | undefined {
    return ITEMS.find((i) => i.id === itemId);
  }

  addItemToInventory(itemId: string, quantity: number = 1): boolean {
    const item = this.getItemById(itemId);
    if (!item) return false;

    const existing = this.inventory.find((i) => i.itemId === itemId);
    if (existing) {
      const newQuantity = Math.min(existing.quantity + quantity, item.maxStack);
      if (newQuantity <= existing.quantity) return false;
      existing.quantity = newQuantity;
    } else {
      if (this.inventory.length >= INVENTORY_SIZE) return false;
      this.inventory.push({
        itemId,
        quantity: Math.min(quantity, item.maxStack),
      });
    }
    return true;
  }

  removeItemFromInventory(itemId: string, quantity: number = 1): boolean {
    const existing = this.inventory.find((i) => i.itemId === itemId);
    if (!existing || existing.quantity < quantity) return false;

    existing.quantity -= quantity;
    if (existing.quantity <= 0) {
      const idx = this.inventory.indexOf(existing);
      this.inventory.splice(idx, 1);
    }
    return true;
  }

  useItem(itemId: string, targetFortune?: FortuneKey): { success: boolean; message: string } {
    const item = this.getItemById(itemId);
    if (!item) return { success: false, message: '道具不存在' };

    const invItem = this.inventory.find((i) => i.itemId === itemId);
    if (!invItem || invItem.quantity <= 0) {
      return { success: false, message: '行囊中没有该道具' };
    }

    if (item.useTiming === 'shop_only') {
      return { success: false, message: '该道具不能在此使用' };
    }

    if (item.useTiming === 'before_choice' && !this.currentEvent) {
      return { success: false, message: '该道具只能在事件抉择前使用' };
    }

    switch (item.effectType) {
      case 'blessing':
        const keys = [...FORTUNE_KEYS];
        const randomKey = keys[Math.floor(this.rng.next() * keys.length)];
        const blessingValue = this.rng.nextInt(5, item.effectValue || 10);
        this.fortune[randomKey] = Math.min(100, this.fortune[randomKey] + blessingValue);
        this.removeItemFromInventory(itemId);
        return {
          success: true,
          message: `福袋开启！${FORTUNE_LABELS_FULL[randomKey]} +${blessingValue}`,
        };

      case 'sachet':
        if (!targetFortune) {
          return { success: false, message: '请选择要提升的运势维度' };
        }
        this.fortune[targetFortune] = Math.min(
          100,
          this.fortune[targetFortune] + (item.effectValue || 8)
        );
        this.removeItemFromInventory(itemId);
        return {
          success: true,
          message: `香囊生效！${FORTUNE_LABELS_FULL[targetFortune]} +${item.effectValue || 8}`,
        };

      case 'gourd':
        for (const key of FORTUNE_KEYS) {
          this.fortune[key] = Math.min(100, this.fortune[key] + (item.effectValue || 5));
        }
        this.removeItemFromInventory(itemId);
        return {
          success: true,
          message: `葫芦生效！所有运势 +${item.effectValue || 5}`,
        };

      case 'amulet':
      case 'candied_haw':
      case 'couplet':
      case 'firecracker':
      case 'fan':
        if (!this.currentEvent) {
          return { success: false, message: '该道具只能在事件抉择前使用' };
        }
        this.activeEffects.push({
          effectType: item.effectType,
          targetFortune,
          effectValue: item.effectValue,
          used: false,
        });
        this.removeItemFromInventory(itemId);
        return { success: true, message: `${item.name}已激活，将在本次选择中生效！` };

      default:
        return { success: false, message: '未知道具类型' };
    }
  }

  buyItem(itemId: string): { success: boolean; message: string } {
    if (!this.currentShop) {
      return { success: false, message: '当前不在摊铺中' };
    }

    const shopItem = this.currentShop.items.find((i) => i.itemId === itemId);
    if (!shopItem) {
      return { success: false, message: '该摊铺不出售此道具' };
    }

    if (shopItem.stock <= 0) {
      return { success: false, message: '该道具已售罄' };
    }

    if (this.fortune.wealth < shopItem.price) {
      return { success: false, message: '财运不足，无法购买' };
    }

    const added = this.addItemToInventory(itemId);
    if (!added) {
      return { success: false, message: '行囊已满，无法购买' };
    }

    this.fortune.wealth -= shopItem.price;
    shopItem.stock--;
    this.sessionSpent += shopItem.price;

    const item = this.getItemById(itemId);
    return {
      success: true,
      message: `成功购买 ${item?.emoji} ${item?.name}！`,
    };
  }

  leaveShop(): void {
    this.currentShop = null;

    if (this.currentNodeIndex >= NODE_COUNT - 1) {
      this.ending = this.createPeacefulEnding();
    }
  }

  private clearActiveEffects(): void {
    this.activeEffects = [];
  }

  private tryDropItem(): string | undefined {
    const droppableItems = ITEMS.filter((i) => i.useTiming !== 'shop_only');
    if (droppableItems.length === 0) return undefined;

    const randomItem = droppableItems[Math.floor(this.rng.next() * droppableItems.length)];
    if (this.addItemToInventory(randomItem.id)) {
      return randomItem.id;
    }
    return undefined;
  }
}
