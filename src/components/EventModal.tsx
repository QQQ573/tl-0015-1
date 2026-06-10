import { useState } from 'react';
import type { GameEvent, EventChoice, InventoryItem, Item, FortuneKey } from '../game/types';
import {
  FORTUNE_LABELS,
  FORTUNE_COLORS,
  FORTUNE_KEYS,
  FORTUNE_LABELS_FULL,
  ITEMS,
  INVENTORY_SIZE,
} from '../game/constants';

interface EventModalProps {
  event: GameEvent;
  onChoice: (index: number) => void;
  resultText: string | null;
  onClose: () => void;
  inventory: InventoryItem[];
  onUseItem: (itemId: string, targetFortune?: FortuneKey) => { success: boolean; message: string };
  droppedItem?: string | null;
}

export function EventModal({
  event,
  onChoice,
  resultText,
  onClose,
  inventory,
  onUseItem,
  droppedItem,
}: EventModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [selectingTarget, setSelectingTarget] = useState<string | null>(null);

  const getItemInfo = (itemId: string): Item | undefined => ITEMS.find((i) => i.id === itemId);

  const handleUseItem = (itemId: string) => {
    const item = getItemInfo(itemId);
    if (!item) return;

    if (item.effectType === 'sachet') {
      setSelectingTarget(itemId);
      return;
    }

    const result = onUseItem(itemId);
    setMessage(result.message);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSelectTarget = (target: FortuneKey) => {
    if (!selectingTarget) return;
    const result = onUseItem(selectingTarget, target);
    setMessage(result.message);
    setSelectingTarget(null);
    setTimeout(() => setMessage(null), 2000);
  };

  const canUseItem = (item: Item) => {
    return item.useTiming === 'before_choice' || item.useTiming === 'any';
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#FFF8E7] border-4 border-[#D4AF37] rounded-2xl max-w-lg w-full shadow-2xl animate-scaleIn">
        <div className="p-6">
          {!resultText && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-600">🎒 行囊 ({inventory.length}/{INVENTORY_SIZE})</h3>
                {selectingTarget && (
                  <span className="text-xs text-[#C8102E] font-bold">请选择运势维度</span>
                )}
              </div>
              <div className="flex gap-2">
                {Array.from({ length: INVENTORY_SIZE }).map((_, idx) => {
                  const invItem = inventory[idx];
                  const item = invItem ? getItemInfo(invItem.itemId) : null;
                  const isSelecting = selectingTarget !== null;
                  const canUse = item && canUseItem(item);

                  if (isSelecting) {
                    return (
                      <div
                        key={idx} className="flex gap-1 flex-1">
                        {FORTUNE_KEYS.map((key) => (
                          <button
                            key={key}
                            onClick={() => handleSelectTarget(key)}
                            className="flex-1 p-2 bg-white border-2 border-[#D4AF37] rounded-lg text-xs font-bold hover:bg-[#FFD700]/20 transition-colors"
                          >
                            {FORTUNE_LABELS[key]}
                          </button>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="relative flex-1">
                      {item && invItem ? (
                        <button
                        onClick={() => canUse ? handleUseItem(item.id) : undefined}
                        disabled={!canUse}
                        className={`w-full p-2 rounded-lg border-2 transition-all relative ${
                          canUse
                            ? 'bg-white border-[#D4AF37] hover:border-[#C8102E] hover:bg-[#FFD700]/20 cursor-pointer'
                            : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                        }`}
                        title={`${item.name}: ${item.description}`}
                      >
                        <div className="text-2xl text-center">{item.emoji}</div>
                        {invItem.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 bg-[#C8102E] text-white text-xs px-1.5 py-0.5 rounded-full">
                            {invItem.quantity}
                          </span>
                        )}
                      </button>
                    ) : (
                      <div className="w-full p-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-full opacity-50" />
                    )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-[#D4AF37]/20 border-2 border-[#D4AF37] rounded-xl text-center font-bold text-[#8B0000]">
              {message}
            </div>
          )}

          {droppedItem && !resultText && (
            <div className="mb-4 p-3 bg-green-100 border-2 border-green-500 rounded-xl text-center font-bold text-green-700">
              🎁 获得道具：{getItemInfo(droppedItem)?.emoji} {getItemInfo(droppedItem)?.name}！
            </div>
          )}

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
