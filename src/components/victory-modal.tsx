'use client';

import { useEffect } from 'react';

interface VictoryModalProps {
  score: number;
  onRestart: () => void;
}

export default function VictoryModal({ score, onRestart }: VictoryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md rounded-lg border-2 border-green-500 bg-black p-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-green-500">Victory!</h2>
        <p className="mb-6 text-green-400">
          Congratulations! You successfully crossed all {score} tiles and made it to the other side!
        </p>
        <button
          onClick={onRestart}
          className="rounded-md bg-green-500 px-6 py-3 font-bold text-black transition-colors hover:bg-green-400"
        >
          Play Again
        </button>
        <p className="mt-4 text-sm text-green-400">Press Enter or Space to restart</p>
      </div>
    </div>
  );
}
