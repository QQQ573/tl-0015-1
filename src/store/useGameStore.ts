import { create } from 'zustand';
import type { GameState, GameRecords, GameEvent, FortuneKey } from '../game/types';
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
  useItem: (itemId: string, targetFortune?: FortuneKey) => { success: boolean; message: string };
  buyItem: (itemId: string) => { success: boolean; message: string };
  leaveShop: () => void;
}

const initialState: GameState = {
  phase: 'select',
  zodiac: null,
  seed: '',
  currentNode: -1,
  fortune: { wealth: 50, love: 50, health: 50, career: 50 },
  nodes: [],
  currentEvent: null,
  currentShop: null,
  eventResult: null,
  ending: null,
  steps: 0,
  inventory: [],
  activeEffects: [],
  shops: [],
  sessionSpent: 0,
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
    const shops = engine.getShops();

    set({
      engine,
      phase: 'playing',
      zodiac,
      seed,
      currentNode: -1,
      fortune,
      nodes,
      currentEvent: null,
      currentShop: null,
      eventResult: null,
      ending: null,
      steps: 0,
      inventory: [],
      activeEffects: [],
      shops,
      sessionSpent: 0,
    });
  },

  moveForward: () => {
    const { engine } = get();
    if (!engine) return;

    const result = engine.moveForward();
    const currentNode = engine.getCurrentNodeIndex();
    const nodes = engine.getNodes();

    if (result?.type === 'event') {
      set({
        currentNode,
        nodes,
        currentEvent: result.event as GameEvent,
        phase: 'event',
        steps: engine.getSteps(),
        inventory: engine.getInventory(),
        activeEffects: engine.getActiveEffects(),
      });
    } else if (result?.type === 'shop') {
      set({
        currentNode,
        nodes,
        currentShop: result.shop,
        phase: 'shop',
        steps: engine.getSteps(),
        inventory: engine.getInventory(),
        shops: engine.getShops(),
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
    const inventory = engine.getInventory();

    if (ending) {
      const sessionSpent = engine.getSessionSpent();
      const itemsPurchased = sessionSpent > 0 ? Math.floor(sessionSpent / 15) : 0;
      const records = recordGameEnd(ending.type, fortune, seed, zodiac.id, itemsPurchased, sessionSpent);
      set({
        fortune,
        eventResult: { choiceIndex, resultText: result.resultText, droppedItem: result.droppedItem },
        ending,
        phase: 'ending',
        records,
        inventory,
      });
    } else {
      set({
        fortune,
        eventResult: { choiceIndex, resultText: result.resultText, droppedItem: result.droppedItem },
        phase: 'event',
        inventory,
        activeEffects: engine.getActiveEffects(),
      });
    }
  },

  closeEventResult: () => {
    set({ eventResult: null, currentEvent: null, phase: 'playing' });
  },

  useItem: (itemId: string, targetFortune?: FortuneKey) => {
    const { engine } = get();
    if (!engine) return { success: false, message: '游戏未开始' };

    const result = engine.useItem(itemId, targetFortune);

    if (result.success) {
      set({
        fortune: engine.getFortune(),
        inventory: engine.getInventory(),
        activeEffects: engine.getActiveEffects(),
      });
    }

    return result;
  },

  buyItem: (itemId: string) => {
    const { engine } = get();
    if (!engine) return { success: false, message: '游戏未开始' };

    const result = engine.buyItem(itemId);

    if (result.success) {
      set({
        fortune: engine.getFortune(),
        inventory: engine.getInventory(),
        currentShop: engine.getCurrentShop(),
        shops: engine.getShops(),
        sessionSpent: engine.getSessionSpent(),
      });
    }

    return result;
  },

  leaveShop: () => {
    const { engine } = get();
    if (!engine) return;

    engine.leaveShop();
    const ending = engine.getEnding();

    if (ending) {
      const { zodiac, seed } = get();
      const fortune = engine.getFortune();
      const sessionSpent = engine.getSessionSpent();
      const itemsPurchased = sessionSpent > 0 ? Math.floor(sessionSpent / 15) : 0;
      const records = recordGameEnd(ending.type, fortune, seed, zodiac!.id, itemsPurchased, sessionSpent);
      set({
        currentShop: null,
        phase: 'ending',
        ending,
        fortune,
        records,
      });
    } else {
      set({
        currentShop: null,
        phase: 'playing',
      });
    }
  },

  resetGame: () => {
    set({
      ...initialState,
      records: get().records,
      engine: null,
    });
  },
}));
