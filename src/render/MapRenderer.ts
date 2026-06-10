import type { MapNode, EventType } from '../game/types';
import { NODE_COUNT, SHOP_NODE_COLOR, SHOP_NAME_EMOJI } from '../game/constants';

interface MapRendererOptions {
  canvas: HTMLCanvasElement;
  nodes: MapNode[];
  currentNodeIndex: number;
  zodiacEmoji?: string;
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  redPacket: '#D4AF37',
  quarrel: '#E57373',
  noble: '#64B5F6',
  loseMoney: '#90A4AE',
  neutral: '#A5D6A7',
};

const NODE_RADIUS = 28;
const PULSE_SPEED = 0.003;

export class MapRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodes: MapNode[];
  private currentNodeIndex: number;
  private zodiacEmoji: string;
  private centerX: number = 0;
  private centerY: number = 0;
  private radius: number = 0;
  private nodePositions: { x: number; y: number }[] = [];
  private animationFrame: number = 0;
  private pulsePhase: number = 0;
  private isAnimating: boolean = false;

  constructor(options: MapRendererOptions) {
    this.canvas = options.canvas;
    this.ctx = options.canvas.getContext('2d')!;
    this.nodes = options.nodes;
    this.currentNodeIndex = options.currentNodeIndex;
    this.zodiacEmoji = options.zodiacEmoji || '🧧';
    this.resize();
  }

  resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    this.centerX = width / 2;
    this.centerY = height / 2;
    this.radius = Math.min(width, height) * 0.35;

    this.calculateNodePositions();
    this.draw();
  }

  private calculateNodePositions(): void {
    this.nodePositions = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
      const x = this.centerX + Math.cos(angle) * this.radius;
      const y = this.centerY + Math.sin(angle) * this.radius;
      this.nodePositions.push({ x, y });
    }
  }

  update(nodes: MapNode[], currentNodeIndex: number, zodiacEmoji?: string): void {
    this.nodes = nodes;
    this.currentNodeIndex = currentNodeIndex;
    if (zodiacEmoji) {
      this.zodiacEmoji = zodiacEmoji;
    }
    this.draw();
  }

  startAnimation(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animate();
  }

  stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private animate = (): void => {
    if (!this.isAnimating) return;
    this.pulsePhase += PULSE_SPEED;
    this.draw();
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  draw(): void {
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);

    this.drawPaths();
    this.drawNodes();
    this.drawPlayer();
    this.drawCenter();
  }

  private drawPaths(): void {
    const ctx = this.ctx;

    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);

    for (let i = 0; i < NODE_COUNT; i++) {
      const next = (i + 1) % NODE_COUNT;
      const p1 = this.nodePositions[i];
      const p2 = this.nodePositions[next];

      if (this.nodes[i]?.visited && this.nodes[next]?.visited) {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
      } else {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      }

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawNodes(): void {
    const ctx = this.ctx;

    for (let i = 0; i < NODE_COUNT; i++) {
      const pos = this.nodePositions[i];
      const node = this.nodes[i];
      const isCurrent = i === this.currentNodeIndex;
      const isVisited = node?.visited;
      const isShop = node?.type === 'shop';

      let color: string;
      let displayText: string;

      if (isShop) {
        color = SHOP_NODE_COLOR;
        displayText = SHOP_NAME_EMOJI;
      } else {
        const eventType = node?.eventId ? this.getEventTypeFromEventId(node.eventId) : 'neutral';
        color = EVENT_TYPE_COLORS[eventType] || '#ccc';
        displayText = `${i + 1}`;
      }

      ctx.save();

      if (isCurrent) {
        const pulseScale = 1 + Math.sin(this.pulsePhase * 6) * 0.15;
        const glowRadius = NODE_RADIUS * 1.8 * pulseScale;

        const gradient = ctx.createRadialGradient(
          pos.x, pos.y, NODE_RADIUS * 0.5,
          pos.x, pos.y, glowRadius
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = isVisited ? color : `${color}66`;
      ctx.strokeStyle = isCurrent ? '#FFD700' : color;
      ctx.lineWidth = isCurrent ? 4 : 2;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFF8E7';
      if (isShop) {
        ctx.font = '20px serif';
      } else {
        ctx.font = 'bold 14px serif';
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayText, pos.x, pos.y);

      ctx.restore();
    }
  }

  private drawPlayer(): void {
    if (this.currentNodeIndex < 0) return;

    const ctx = this.ctx;
    const pos = this.nodePositions[this.currentNodeIndex];
    const bobOffset = Math.sin(this.pulsePhase * 4) * 5;

    ctx.save();
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.zodiacEmoji, pos.x, pos.y - NODE_RADIUS - 15 + bobOffset);
    ctx.restore();
  }

  private drawCenter(): void {
    const ctx = this.ctx;

    ctx.save();

    ctx.fillStyle = '#FFF8E7';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#C8102E';
    ctx.font = 'bold 24px "Ma Shan Zheng", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('庙会', this.centerX, this.centerY);

    ctx.restore();
  }

  private getEventTypeFromEventId(eventId: string): EventType {
    if (eventId.startsWith('redpacket')) return 'redPacket';
    if (eventId.startsWith('quarrel')) return 'quarrel';
    if (eventId.startsWith('noble')) return 'noble';
    if (eventId.startsWith('losemoney')) return 'loseMoney';
    return 'neutral';
  }

  getNodePosition(index: number): { x: number; y: number } | null {
    if (index < 0 || index >= this.nodePositions.length) return null;
    return { ...this.nodePositions[index] };
  }

  destroy(): void {
    this.stopAnimation();
  }
}
