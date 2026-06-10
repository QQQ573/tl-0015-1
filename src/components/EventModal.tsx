import type { GameEvent, EventChoice } from '../game/types';
import { FORTUNE_LABELS, FORTUNE_COLORS, FORTUNE_KEYS } from '../game/constants';

interface EventModalProps {
  event: GameEvent;
  onChoice: (index: number) => void;
  resultText: string | null;
  onClose: () => void;
}

export function EventModal({ event, onChoice, resultText, onClose }: EventModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#FFF8E7] border-4 border-[#D4AF37] rounded-2xl max-w-lg w-full shadow-2xl animate-scaleIn">
        <div className="p-6">
          <h2
            className="text-2xl font-bold text-[#C8102E] mb-4 text-center"
            style={{ fontFamily: '"Ma Shan Zheng", serif' }}
          >
            {event.title}
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed text-center">
            {event.description}
          </p>

          {resultText ? (
            <div className="space-y-4">
              <div className="bg-[#D4AF37]/20 border-2 border-[#D4AF37] rounded-xl p-4">
                <p className="text-[#8B0000] font-medium">{resultText}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                style={{ fontFamily: '"Ma Shan Zheng", serif' }}
              >
                继续前行 →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {event.choices.map((choice, index) => (
                <ChoiceButton key={index} choice={choice} onClick={() => onChoice(index)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ChoiceButtonProps {
  choice: EventChoice;
  onClick: () => void;
}

function ChoiceButton({ choice, onClick }: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 text-left bg-white border-2 border-[#D4AF37] rounded-xl hover:border-[#C8102E] hover:bg-[#FFD700]/10 transition-all group"
    >
      <p className="font-bold text-gray-800 mb-2 group-hover:text-[#C8102E] transition-colors">
        {choice.text}
      </p>
      <div className="flex flex-wrap gap-2">
        {FORTUNE_KEYS.map((key) => {
          const value = choice.effect[key];
          if (value === undefined || value === 0) return null;
          const isPositive = value > 0;
          return (
            <span
              key={key}
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {FORTUNE_LABELS[key]} {isPositive ? '+' : ''}{value}
            </span>
          );
        })}
      </div>
    </button>
  );
}
