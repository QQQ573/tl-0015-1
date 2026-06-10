export interface Fortune {
  wealth: number;
  love: number;
  health: number;
  career: number;
}

export type FortuneKey = keyof Fortune;

export interface Zodiac {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bonus: Partial<Fortune>;
}

export interface EventChoice {
  text: string;
  effect: Partial<Fortune>;
  resultText: string;
}

export type EventType = 'redPacket' | 'quarrel' | 'noble' | 'loseMoney' | 'neutral';

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  choices: EventChoice[];
  zodiacExclusive?: string[];
  rarity?: 'common' | 'uncommon' | 'rare';
}

export interface EventVariant {
  descriptionSnippets: string[];
  resultSnippets: Record<string, string[]>;
}

export type EndingType =
  | 'wealth_peak'
  | 'wealth_valley'
  | 'love_peak'
  | 'love_valley'
  | 'health_peak'
  | 'health_valley'
  | 'career_peak'
  | 'career_valley'
  | 'peaceful';

export interface Ending {
  type: EndingType;
  title: string;
  description: string;
  fortune: Fortune;
}

export type ItemEffectType = 'amulet' | 'candied_haw' | 'couplet' | 'blessing' | 'firecracker' | 'sachet' | 'fan' | 'gourd';

export type ItemUseTiming = 'before_choice' | 'after_choice' | 'any' | 'shop_only';

export interface Item {
  id: string;
  name: string;
  emoji: string;
  description: string;
  effectType: ItemEffectType;
  effectValue?: number;
  targetFortune?: FortuneKey;
  maxStack: number;
  useTiming: ItemUseTiming;
  basePrice: number;
  priceVariance: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface ShopItem {
  itemId: string;
  price: number;
  stock: number;
  maxStock: number;
}

export interface Shop {
  nodeIndex: number;
  items: ShopItem[];
  visited: boolean;
}

export type NodeType = 'event' | 'shop';

export interface MapNode {
  index: number;
  type: NodeType;
  eventId?: string;
  shopId?: string;
  visited: boolean;
}

export type GamePhase = 'select' | 'playing' | 'event' | 'shop' | 'ending';

export interface ActiveItemEffect {
  effectType: ItemEffectType;
  targetFortune?: FortuneKey;
  effectValue?: number;
  used: boolean;
}

export interface EventResult {
  choiceIndex: number;
  resultText: string;
  droppedItem?: string | null;
}

export interface GameState {
  phase: GamePhase;
  zodiac: Zodiac | null;
  seed: string;
  currentNode: number;
  fortune: Fortune;
  nodes: MapNode[];
  currentEvent: GameEvent | null;
  currentShop: Shop | null;
  eventResult: EventResult | null;
  ending: Ending | null;
  steps: number;
  inventory: InventoryItem[];
  activeEffects: ActiveItemEffect[];
  shops: Shop[];
  sessionSpent: number;
}

export interface GameRecords {
  totalGames: number;
  bestEnding: {
    type: EndingType;
    fortune: Fortune;
    seed: string;
    date: string;
  } | null;
  endingCounts: Record<string, number>;
  zodiacCounts: Record<string, number>;
  totalItemsPurchased: number;
  highestSessionSpent: number;
}
