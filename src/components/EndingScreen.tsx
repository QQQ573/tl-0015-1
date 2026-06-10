import { useState } from 'react';
import type { Ending, Fortune, GameRecords } from '../game/types';
import { FORTUNE_LABELS, FORTUNE_COLORS, FORTUNE_KEYS } from '../game/constants';
import { ENDING_TEXTS } from '../game/constants';
import { GameEngine } from '../game/GameEngine';

interface EndingScreenProps {
  ending: Ending;
  seed: string;
  zodiacEmoji: string;
  zodiacName: string;
  steps: number;
  records: GameRecords;
  onRestart: () => void;
}

export function EndingScreen({
  ending,
  seed,
  zodiacEmoji,
  zodiacName,
  steps,
  records,
  onRestart,
}: EndingScreenProps) {
  const [copied, setCopied] = useState(false);
  const isPeak = ending.type.endsWith('_peak');
  const isValley = ending.type.endsWith('_valley');

  const copySeed = async () => {
    try {
      await navigator.clipboard.writeText(seed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy seed:', e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-gradient-to-b from-[#FFF8E7] to-[#FFE4B5] border-4 border-[#D4AF37] rounded-2xl max-w-lg w-full shadow-2xl animate-scaleIn my-8">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce">
              {isPeak ? '🎉' : isValley ? '😢' : '🧧'}
            </div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{
                fontFamily: '"Ma Shan Zheng", serif',
                color: isPeak ? '#D4AF37' : isValley ? '#C8102E' : '#2D5A27',
              }}
            >
              {ending.title}
            </h1>
            <p className="text-gray-600 text-sm">
              {zodiacEmoji} {zodiacName} · 第 {steps} 站
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-4 mb-6 border-2 border-[#D4AF37]/50">
            <p className="text-gray-700 leading-relaxed">{ending.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#C8102E] mb-3 text-center">最终运势</h3>
            <div className="grid grid-cols-2 gap-3">
              {FORTUNE_KEYS.map((key) => {
                const value = ending.fortune[key];
                const color = FORTUNE_COLORS[key];
                const isMax = value >= 100;
                const isMin = value <= 0;
                return (
                  <div key={key} className="bg-white rounded-xl p-3 shadow-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold" style={{ color }}>
                        {FORTUNE_LABELS[key]}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          isMax ? 'text-yellow-500' : isMin ? 'text-red-500' : 'text-gray-700'
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${value}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#D4AF37]/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">本局种子</p>
                <p className="font-mono font-bold text-[#8B0000]">{seed}</p>
              </div>
              <button
                onClick={copySeed}
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-bold hover:bg-[#B8960C] transition-colors text-sm"
              >
                {copied ? '✓ 已复制' : '📋 复制'}
              </button>
            </div>
          </div>

          {records.bestEnding && (
            <div className="bg-[#2D5A27]/10 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-[#2D5A27] mb-2 text-center">🏆 最佳结局</h4>
              <p className="text-center text-sm text-gray-600">
                {ENDING_TEXTS[records.bestEnding.type]?.title || records.bestEnding.type}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600 mb-6">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-2xl font-bold text-[#C8102E]">{records.totalGames}</p>
              <p>总对局数</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-2xl font-bold text-[#D4AF37]">{Object.keys(records.endingCounts).length}</p>
              <p>解锁结局</p>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full py-4 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-xl font-bold text-xl hover:opacity-90 transition-opacity"
            style={{ fontFamily: '"Ma Shan Zheng", serif' }}
          >
            🔄 再来一局
          </button>
        </div>
      </div>
    </div>
  );
}
