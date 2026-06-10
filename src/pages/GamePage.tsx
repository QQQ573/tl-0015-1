import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { GameMap } from '../components/GameMap';
import { FortunePanel } from '../components/FortunePanel';
import { EventModal } from '../components/EventModal';
import { ShopModal } from '../components/ShopModal';
import { EndingScreen } from '../components/EndingScreen';
import { Home, RotateCcw } from 'lucide-react';
import { NODE_COUNT, ITEMS } from '../game/constants';

export function GamePage() {
  const navigate = useNavigate();
  const {
    zodiac,
    seed,
    currentNode,
    fortune,
    nodes,
    currentEvent,
    currentShop,
    eventResult,
    ending,
    steps,
    records,
    inventory,
    moveForward,
    makeChoice,
    closeEventResult,
    resetGame,
    useItem,
    buyItem,
    leaveShop,
  } = useGameStore();

  const handleBack = () => {
    resetGame();
    navigate('/');
  };

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  const canMove = !currentEvent && !currentShop && !ending && currentNode < NODE_COUNT - 1;

  if (!zodiac) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">请先选择生肖</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#C8102E] text-white rounded-xl font-bold hover:bg-[#8B0000] transition-colors"
          >
            返回选择
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C8102E] via-[#8B0000] to-[#4A0000] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFF8E7]/20 text-white rounded-lg hover:bg-[#FFF8E7]/30 transition-colors"
          >
            <Home size={18} />
            <span className="text-sm">首页</span>
          </button>

          <div className="text-center">
            <div className="text-2xl">{zodiac.emoji}</div>
            <div className="text-[#FFD700] text-sm font-bold">{zodiac.name}</div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFF8E7]/20 text-white rounded-lg hover:bg-[#FFF8E7]/30 transition-colors"
          >
            <RotateCcw size={18} />
            <span className="text-sm">重开</span>
          </button>
        </div>

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-[#FFF8E7]/20 px-4 py-2 rounded-full text-white text-sm">
            <span>种子: {seed}</span>
            <span className="text-[#FFD700]">第 {Math.max(0, currentNode + 1)} / {NODE_COUNT} 站</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <GameMap nodes={nodes} currentNodeIndex={currentNode} zodiacEmoji={zodiac.emoji} />
          </div>

          <div className="space-y-4">
            <FortunePanel fortune={fortune} />

            <button
              onClick={moveForward}
              disabled={!canMove}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                canMove
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-[#8B0000] hover:scale-105 hover:shadow-lg cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              style={{ fontFamily: '"Ma Shan Zheng", serif' }}
            >
              {currentNode < 0 ? '🚶 出发！' : '👣 往前走'}
            </button>

            {ending && (
              <button
                onClick={handleRestart}
                className="w-full py-3 bg-[#2D5A27] text-white rounded-xl font-bold hover:bg-[#1E3D1B] transition-colors"
              >
                🔄 再来一局
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-white/60 text-xs">
          <p>💡 提示：点击「往前走」触发事件，选择不同应对改变运势</p>
          <p>🏮 红色节点是庙会摊铺，可以用财运购买道具</p>
          <p>🎒 事件抉择前可以使用行囊中的道具增强效果</p>
        </div>
      </div>

      {currentEvent && (
        <EventModal
          event={currentEvent}
          onChoice={makeChoice}
          resultText={eventResult?.resultText || null}
          onClose={closeEventResult}
          inventory={inventory}
          onUseItem={useItem}
          droppedItem={(eventResult as any)?.droppedItem || null}
        />
      )}

      {currentShop && (
        <ShopModal
          shop={currentShop}
          items={ITEMS}
          currentWealth={fortune.wealth}
          onBuy={buyItem}
          onClose={leaveShop}
        />
      )}

      {ending && !eventResult && (
        <EndingScreen
          ending={ending}
          seed={seed}
          zodiacEmoji={zodiac.emoji}
          zodiacName={zodiac.name}
          steps={steps}
          records={records}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
