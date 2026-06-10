import { useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import type { Zodiac } from '../game/types';
import { FORTUNE_LABELS, FORTUNE_COLORS } from '../game/constants';

interface ZodiacSelectProps {
  onSelect: (zodiacId: string, seed: string) => void;
  seed: string;
  onSeedChange: (seed: string) => void;
  onRandomSeed: () => void;
}

export function ZodiacSelect({ onSelect, seed, onSeedChange, onRandomSeed }: ZodiacSelectProps) {
  const [selectedZodiac, setSelectedZodiac] = useState<Zodiac | null>(null);
  const zodiacs = GameEngine.getAllZodiacs();

  const handleStart = () => {
    if (selectedZodiac) {
      onSelect(selectedZodiac.id, seed || GameEngine.generateRandomSeed());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C8102E] via-[#8B0000] to-[#4A0000] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold text-[#FFD700] mb-4"
            style={{ fontFamily: '"Ma Shan Zheng", serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            🏮 初一庙会抽签 🏮
          </h1>
          <p className="text-[#FFF8E7] text-lg">选择你的生肖，开启新年运势之旅</p>
        </div>

        <div className="bg-[#FFF8E7] border-4 border-[#D4AF37] rounded-2xl p-6 mb-6 shadow-2xl">
          <h2
            className="text-2xl font-bold text-[#C8102E] mb-4 text-center"
            style={{ fontFamily: '"Ma Shan Zheng", serif' }}
          >
            十二生肖
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3">
            {zodiacs.map((zodiac) => (
              <button
                key={zodiac.id}
                onClick={() => setSelectedZodiac(zodiac)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  selectedZodiac?.id === zodiac.id
                    ? 'bg-[#FFD700] border-4 border-[#C8102E] scale-110 shadow-lg'
                    : 'bg-white border-2 border-[#D4AF37] hover:border-[#C8102E] hover:scale-105'
                }`}
              >
                <span className="text-3xl mb-1">{zodiac.emoji}</span>
                <span className="text-sm font-bold text-[#C8102E]">{zodiac.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedZodiac && (
          <div className="bg-[#FFF8E7] border-4 border-[#D4AF37] rounded-2xl p-6 mb-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{selectedZodiac.emoji}</span>
              <div>
                <h3
                  className="text-3xl font-bold text-[#C8102E]"
                  style={{ fontFamily: '"Ma Shan Zheng", serif' }}
                >
                  {selectedZodiac.name}
                </h3>
                <p className="text-gray-600">{selectedZodiac.description}</p>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-[#D4AF37] pt-4">
              <p className="text-sm text-gray-500 mb-2">初始运势加成：</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(selectedZodiac.bonus).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: FORTUNE_COLORS[key] + '33', color: FORTUNE_COLORS[key] }}
                  >
                    {FORTUNE_LABELS[key]} +{value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#FFF8E7] border-4 border-[#D4AF37] rounded-2xl p-6 mb-6 shadow-2xl">
          <h3
            className="text-xl font-bold text-[#C8102E] mb-4"
            style={{ fontFamily: '"Ma Shan Zheng", serif' }}
          >
            种子（可选）
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={seed}
              onChange={(e) => onSeedChange(e.target.value)}
              placeholder="输入种子复现对局"
              className="flex-1 px-4 py-3 border-2 border-[#D4AF37] rounded-xl bg-white text-gray-700 focus:outline-none focus:border-[#C8102E] transition-colors"
            />
            <button
              onClick={onRandomSeed}
              className="px-6 py-3 bg-[#2D5A27] text-white rounded-xl font-bold hover:bg-[#1E3D1B] transition-colors"
            >
              🎲 随机
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={!selectedZodiac}
            className={`px-12 py-4 text-2xl font-bold rounded-2xl transition-all duration-300 ${
              selectedZodiac
                ? 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-[#8B0000] hover:scale-105 hover:shadow-2xl cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={{ fontFamily: '"Ma Shan Zheng", serif' }}
          >
            🧧 开始抽签 🧧
          </button>
        </div>

        <div className="mt-8 text-center text-[#FFF8E7] text-sm opacity-80">
          <p>💡 提示：相同种子 + 相同生肖 = 相同对局</p>
          <p>走完 12 个节点，或任一运势归零/满值触发结局</p>
        </div>
      </div>
    </div>
  );
}
