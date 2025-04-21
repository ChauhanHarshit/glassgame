'use client';

import { cn } from '../lib/utils';

interface GlassTileProps {
  status: 'unselected' | 'correct' | 'wrong' | 'current';
  isBreaking: boolean;
  characterImages: React.ReactNode[];
  ref: React.RefObject<HTMLDivElement | null>;
  // onClick: () => void
}

const GlassTile = (props: GlassTileProps) => {
  const { status, isBreaking, characterImages, ref } = props;
  return (
    <div
      ref={ref}
      // onClick={onClick}
      className={cn(
        'glass-tile relative',
        status === 'unselected' && 'glass-tile-unselected',
        status === 'current' && 'glass-tile-current',
        status === 'correct' && 'glass-tile-correct',
        status === 'wrong' && 'glass-tile-wrong',
        isBreaking && 'glass-tile-breaking'
      )}
    >
      {characterImages.map((characterImage, index) => (
        <div key={`character-image-${index}`} className="absolute top-0 left-0">
          {characterImage}
        </div>
      ))}
      <div 
        className={cn(
          'glass-tile-inner',
          isBreaking && 'opacity-0 transition-opacity duration-300'
        )}
      >
        <div className="glass-tile-reflection"></div>
      </div>
    </div>
  );
};

GlassTile.displayName = 'GlassTile';

export default GlassTile;
