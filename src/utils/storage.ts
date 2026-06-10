import type { GameRecords, EndingType, Fortune } from '../game/types';
import { STORAGE_KEY } from '../game/constants';

const DEFAULT_RECORDS: GameRecords = {
  totalGames: 0,
  bestEnding: null,
  endingCounts: {},
  zodiacCounts: {},
  totalItemsPurchased: 0,
  highestSessionSpent: 0,
};

export function loadRecords(): GameRecords {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load records:', e);
  }
  return { ...DEFAULT_RECORDS };
}

export function saveRecords(records: GameRecords): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records:', e);
  }
}

export function recordGameEnd(
  endingType: EndingType,
  fortune: Fortune,
  seed: string,
  zodiacId: string,
  itemsPurchased: number = 0,
  sessionSpent: number = 0
): GameRecords {
  const records = loadRecords();

  records.totalGames++;

  records.endingCounts[endingType] = (records.endingCounts[endingType] || 0) + 1;

  records.zodiacCounts[zodiacId] = (records.zodiacCounts[zodiacId] || 0) + 1;

  records.totalItemsPurchased = (records.totalItemsPurchased || 0) + itemsPurchased;

  if (sessionSpent > (records.highestSessionSpent || 0)) {
    records.highestSessionSpent = sessionSpent;
  }

  const endingScore = calculateEndingScore(endingType, fortune);
  const currentBestScore = records.bestEnding
    ? calculateEndingScore(records.bestEnding.type, records.bestEnding.fortune)
    : -Infinity;

  if (endingScore > currentBestScore) {
    records.bestEnding = {
      type: endingType,
      fortune: { ...fortune },
      seed,
      date: new Date().toISOString(),
    };
  }

  saveRecords(records);
  return records;
}

function calculateEndingScore(type: EndingType, fortune: Fortune): number {
  if (type.endsWith('_peak')) {
    return 1000 + Math.max(fortune.wealth, fortune.love, fortune.health, fortune.career);
  }
  if (type === 'peaceful') {
    const avg = (fortune.wealth + fortune.love + fortune.health + fortune.career) / 4;
    return 500 + avg;
  }
  return Math.min(fortune.wealth, fortune.love, fortune.health, fortune.career);
}

export function resetRecords(): GameRecords {
  const records = { ...DEFAULT_RECORDS };
  saveRecords(records);
  return records;
}
