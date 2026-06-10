import { useState } from 'react';
import type { Shop, Item } from '../game/types';
import { FORTUNE_LABELS_FULL } from '../game/constants';
import { Coins } from 'lucide-react';

interface ShopModalProps {
  shop: Shop;
  items: Item[];
  currentWealth: number;
  onBuy: (itemId: string) => { success: boolean; message: string };
  onClose: () => void;
}

export function ShopModal({ shop, items, currentWealth, onBuy, onClose }: ShopModalProps) {
  const [message, setMessage] = useState<string | null>(null);

  const getItemInfo = (itemId: string) => items.find((i) => i.id === itemId);

  const handleBuy = (itemId: string) => {
    const result = onBuy(itemId);
    setMessage(result.message);
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#FFF8E7] border-4 border-[#FF6B6B] rounded-2xl max-w-2xl w-full shadow-2xl animate-scaleIn">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🏮</div>
            <h2
              className="text-3xl font-bold text-[#C8102E] mb-2"
              style={{ fontFamily: '"Ma Shan Zheng", serif' }}
            >
              庙会摊铺
            </h2>
            <p className="text-gray-600">第 {shop.nodeIndex + 1} 站摊铺，走过路过不要错过！</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-[#D4AF37] font-bold">
              <Coins size={20} />
              <span>当前财运: {currentWealth}</span>
            </div>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-[#D4AF37]/20 border-2 border-[#D4AF37] rounded-xl text-center font-bold text-[#8B0000]">
              {message}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {shop.items.map((shopItem) => {
              const item = getItemInfo(shopItem.itemId);
              if (!item) return null;

              const canAfford = currentWealth >= shopItem.price;
              const inStock = shopItem.stock > 0;
              const canBuy = canAfford && inStock;

              return (
                <div
                  key={shopItem.itemId}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    canBuy
                      ? 'bg-white border-[#D4AF37] hover:border-[#C8102E] hover:shadow-lg'
                      : 'bg-gray-100 border-gray-300 opacity-70'
                  }`}
                >
                  <div className="text-4xl text-center mb-2">{item.emoji}</div>
                  <h3 className="font-bold text-center text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 text-center mb-3 h-10 overflow-hidden">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-[#D4AF37] font-bold flex items-center gap-1">
                      <Coins size={14} />
                      {shopItem.price}
                    </span>
                    <span className={inStock ? 'text-green-600' : 'text-red-500'}>
                      库存: {shopItem.stock}/{shopItem.maxStock}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuy(shopItem.itemId)}
                    disabled={!canBuy}
                    className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                      canBuy
                        ? 'bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white hover:opacity-90 cursor-pointer'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {!inStock ? '已售罄' : !canAfford ? '财运不足' : '购买'}
                  </button>

                  {!canAfford && inStock && (
                    <p className="text-xs text-red-500 text-center mt-1">
                      还差 {shopItem.price - currentWealth} 财运
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-[#8B0000] rounded-xl font-bold hover:opacity-90 transition-opacity"
            style={{ fontFamily: '"Ma Shan Zheng", serif' }}
          >
            继续逛庙会 →
          </button>
        </div>
      </div>
    </div>
  );
}
