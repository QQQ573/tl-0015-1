import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { ZodiacSelect } from '../components/ZodiacSelect';
import { GameEngine } from '../game/GameEngine';

export function HomePage() {
  const navigate = useNavigate();
  const { startGame } = useGameStore();
  const [seed, setSeed] = useState('');

  const handleStart = (zodiacId: string, seedValue: string) => {
    startGame(zodiacId, seedValue);
    navigate('/game');
  };

  const handleRandomSeed = () => {
    setSeed(GameEngine.generateRandomSeed());
  };

  return (
    <ZodiacSelect
      onSelect={handleStart}
      seed={seed}
      onSeedChange={setSeed}
      onRandomSeed={handleRandomSeed}
    />
  );
}
