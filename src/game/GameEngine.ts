import type { Fortune, Zodiac, GameEvent, Ending, MapNode, EndingType, EventChoice } from './types';
import { ZODIACS, EVENTS, ENDING_TEXTS, INITIAL_FORTUNE, NODE_COUNT, FORTUNE_KEYS } from './constants';
import { SeededRandom } from './SeededRandom';

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
    this.rng = new SeededRandom(seed);
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
    const eventTypes = ['redPacket', 'quarrel', 'noble', 'loseMoney', 'neutral', 'neutral'] as const;
    const nodes: MapNode[] = [];

    const shuffledTypes = this.rng.shuffle([...eventTypes, ...eventTypes]);

    for (let i = 0; i < NODE_COUNT; i++) {
      const type = shuffledTypes[i];
      const eventsOfType = EVENTS.filter((e) => e.type === type);
      const event = this.rng.pick(eventsOfType);

      nodes.push({
        index: i,
        eventId: event.id,
        visited: false,
      });
    }

    return nodes;
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
