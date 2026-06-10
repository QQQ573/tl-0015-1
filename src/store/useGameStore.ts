import { create } from 'zustand';
import type { GameState, GameRecords, GameEvent } from '../game/types';
import { GameEngine } from '../game/GameEngine';
import { loadRecords, recordGameEnd } from '../utils/storage';

interface GameStore extends GameState {
  records: GameRecords;
  engine: GameEngine | null;
  startGame: (zodiacId: string, seed: string) => void;
  moveForward: () => void;
  makeChoice: (choiceIndex: number) => void;
  resetGame: () => void;
  closeEventResult: () => void;
  loadRecords: () => void;
}

const initialState: GameState = {
  phase: 'select',
  zodiac: null,
  seed: '',
  currentNode: -1,
  fortune: { wealth: 50, love: 50, health: 50, career: 50 },
  nodes: [],
  currentEvent: null,
  eventResult: null,
  ending: null,
  steps: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  records: loadRecords(),
  engine: null,

  loadRecords: () => {
    set({ records: loadRecords() });
  },

  startGame: (zodiacId: string, seed: string) => {
    const engine = new GameEngine(zodiacId, seed);
    const zodiac = engine.getZodiac();
    const fortune = engine.getFortune();
    const nodes = engine.getNodes();

    set({
      engine,
      phase: 'playing',
      zodiac,
      seed,
      currentNode: -1,
      fortune,
      nodes,
      currentEvent: null,
      eventResult: null,
      ending: null,
      steps: 0,
    });
  },

  moveForward: () => {
    const { engine } = get();
    if (!engine) return;

    const event = engine.moveForward();
    const currentNode = engine.getCurrentNodeIndex();
    const nodes = engine.getNodes();

    if (event) {
      set({
        currentNode,
        nodes,
        currentEvent: event as GameEvent,
        phase: 'event',
        steps: engine.getSteps(),
      });
    } else {
      set({
        currentNode,
        nodes,
        steps: engine.getSteps(),
      });
    }
  },

  makeChoice: (choiceIndex: number) => {
    const { engine, zodiac, seed } = get();
    if (!engine || !zodiac) return;

    const result = engine.makeChoice(choiceIndex);
    const fortune = engine.getFortune();
    const ending = engine.getEnding();

    if (ending) {
      const records = recordGameEnd(ending.type, fortune, seed, zodiac.id);
      set({
        fortune,
        eventResult: { choiceIndex, resultText: result.resultText },
        ending,
        phase: 'ending',
        records,
      });
    } else {
      set({
        fortune,
        eventResult: { choiceIndex, resultText: result.resultText },
        phase: 'playing',
      });
    }
  },

  closeEventResult: () => {
    set({ eventResult: null, currentEvent: null });
  },

  resetGame: () => {
    set({
      ...initialState,
      records: get().records,
      engine: null,
    });
  },
}));
