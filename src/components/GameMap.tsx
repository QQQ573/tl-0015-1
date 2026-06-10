import { useEffect, useRef } from 'react';
import { MapRenderer } from '../render/MapRenderer';
import type { MapNode } from '../game/types';

interface GameMapProps {
  nodes: MapNode[];
  currentNodeIndex: number;
  zodiacEmoji: string;
}

export function GameMap({ nodes, currentNodeIndex, zodiacEmoji }: GameMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<MapRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new MapRenderer({
      canvas: canvasRef.current,
      nodes,
      currentNodeIndex,
      zodiacEmoji,
    });

    rendererRef.current = renderer;
    renderer.startAnimation();

    const handleResize = () => {
      renderer.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.destroy();
    };
  }, []);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.update(nodes, currentNodeIndex, zodiacEmoji);
    }
  }, [nodes, currentNodeIndex, zodiacEmoji]);

  return (
    <div className="bg-[#FFF8E7] border-4 border-[#D4AF37] rounded-2xl p-4 shadow-lg">
      <h3
        className="text-xl font-bold text-[#C8102E] mb-2 text-center"
        style={{ fontFamily: '"Ma Shan Zheng", serif' }}
      >
        庙会地图
      </h3>
      <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="flex justify-center gap-4 mt-3 text-xs">
        <LegendItem color="#D4AF37" label="红包" />
        <LegendItem color="#E57373" label="口舌" />
        <LegendItem color="#64B5F6" label="贵人" />
        <LegendItem color="#90A4AE" label="破财" />
        <LegendItem color="#A5D6A7" label="平常" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-gray-600">{label}</span>
    </div>
  );
}
