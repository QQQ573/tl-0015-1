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

export interface MapNode {
  index: number;
  eventId: string;
  visited: boolean;
}

export type GamePhase = 'select' | 'playing' | 'event' | 'ending';

export interface GameState {
  phase: GamePhase;
  zodiac: Zodiac | null;
  seed: string;
  currentNode: number;
  fortune: Fortune;
  nodes: MapNode[];
  currentEvent: GameEvent | null;
  eventResult: { choiceIndex: number; resultText: string } | null;
  ending: Ending | null;
  steps: number;
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
}
