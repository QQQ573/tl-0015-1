import type { Fortune } from '../game/types';
import { FORTUNE_LABELS, FORTUNE_COLORS, FORTUNE_KEYS } from '../game/constants';

interface FortunePanelProps {
  fortune: Fortune;
}

export function FortunePanel({ fortune }: FortunePanelProps) {
  return (
    <div className="bg-[#FFF8E7] border-4 border-[#D4AF37] rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-[#C8102E] mb-4 text-center" style={{ fontFamily: '"Ma Shan Zheng", serif' }}>
        运势面板
      </h3>
      <div className="space-y-4">
        {FORTUNE_KEYS.map((key) => {
          const value = fortune[key];
          const color = FORTUNE_COLORS[key];
          const label = FORTUNE_LABELS[key];
          const isHigh = value >= 80;
          const isLow = value <= 20;

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg" style={{ color }}>
                  {label}
                </span>
                <span
                  className={`font-mono font-bold text-lg ${
                    isHigh ? 'text-green-600' : isLow ? 'text-red-500' : 'text-gray-700'
                  }`}
                >
                  {value}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2" style={{ borderColor: color }}>
                <div
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${value}%`,
                    backgroundColor: color,
                    boxShadow: isHigh ? `0 0 10px ${color}` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
