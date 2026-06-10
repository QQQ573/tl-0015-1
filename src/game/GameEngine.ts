import type { Fortune, Zodiac, GameEvent, Ending, MapNode, EndingType, EventType } from './types';
import { ZODIACS, EVENTS, ENDING_TEXTS, INITIAL_FORTUNE, NODE_COUNT, FORTUNE_KEYS } from './constants';
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
  private ending: Ending | null = null;
  private steps: number = 0;

  constructor(zodiacId: string, seed: string) {
    const zodiac = ZODIACS.find((z) => z.id === zodiacId);
    if (!zodiac) {
      throw new Error(`Zodiac not found: ${zodiacId}`);
    }

    this.zodiac = zodiac;
    this.rng = new SeededRandom(`temple-fair:${seed}:${zodiacId}`);
    this.fortune = this.calculateInitialFortune();
    this.currentNodeIndex = -1;
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

  private generateNodes(): MapNode[] {
    const nodes: MapNode[] = [];
    const availableEvents = this.getFilteredEvents();

    if (availableEvents.length < NODE_COUNT) {
      console.warn(
        `可用事件数(${availableEvents.length})少于节点数(${NODE_COUNT})，可能会有重复`
      );
    }

    const selectedEvents = this.selectUniqueEvents(availableEvents, NODE_COUNT);

    const shuffledEvents = this.rng.shuffle(selectedEvents);

    for (let i = 0; i < NODE_COUNT && i < shuffledEvents.length; i++) {
      nodes.push({
        index: i,
        eventId: shuffledEvents[i].id,
        visited: false,
      });
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
      this.currentEvent === null
    );
  }

  moveForward(): GameEvent | null {
    if (!this.canMoveForward()) {
      return null;
    }

    this.currentNodeIndex++;
    this.steps++;

    const node = this.nodes[this.currentNodeIndex];
    node.visited = true;

    const event = EVENTS.find((e) => e.id === node.eventId);
    if (!event) {
      throw new Error(`Event not found: ${node.eventId}`);
    }

    this.currentEvent = event;
    return { ...event };
  }

  makeChoice(choiceIndex: number): { resultText: string; ending: Ending | null } {
    if (!this.currentEvent) {
      throw new Error('No current event');
    }

    const choice = this.currentEvent.choices[choiceIndex];
    if (!choice) {
      throw new Error(`Invalid choice index: ${choiceIndex}`);
    }

    this.applyEffect(choice.effect);
    const ending = this.checkEnding();

    this.currentEvent = null;

    if (ending) {
      this.ending = ending;
    } else if (this.currentNodeIndex >= NODE_COUNT - 1) {
      this.ending = this.createPeacefulEnding();
    }

    return {
      resultText: choice.resultText,
      ending: this.ending ? { ...this.ending } : null,
    };
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
}
