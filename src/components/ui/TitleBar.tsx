//modules
import React from 'react';
import Image from 'next/image';
//assets
import GameIcon from '@/assets/game_icon.svg';
import ForwardIcon from '@/assets/forward.svg';
import FastForwardIcon from '@/assets/fast_forward.svg';
import MuteIcon from '@/assets/mute.svg';
import UnmuteIcon from '@/assets/unmute.svg';
import PlayIcon from '@/assets/play.svg';
import PauseIcon from '@/assets/pause.svg';

interface TitleBarProps {
  onRewind: () => void;
  onPreviousStep: () => void;
  onPlayToggle: () => void;
  onNextStep: () => void;
  onFastForward: () => void;
  onMuteToggle: () => void;
  isMuted: boolean;
  isPlaying: boolean;
}

const TitleBar = (props: TitleBarProps) => {
  const {
    onRewind,
    onPreviousStep,
    onPlayToggle,
    onNextStep,
    onFastForward,
    onMuteToggle,
    isMuted,
    isPlaying,
  } = props;
  return (
    <div className="flex items-center gap-8">
      <Image src={GameIcon} alt="Game Icon" width={68} height={56} />

      <span className="flex h-full flex-1 items-center rounded-lg border border-[var(--neon-green)] p-3 font-['Press_Start_2P'] text-lg">
        Welcome To Sentient Struggle
      </span>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <button className="rotate-180 cursor-pointer" onClick={onRewind}>
          <Image src={FastForwardIcon} alt="Fast Forward" height={26} />
        </button>
        <button className="rotate-180 cursor-pointer" onClick={onPreviousStep}>
          <Image src={ForwardIcon} alt="Forward" height={26} />
        </button>
        <button className="cursor-pointer" onClick={onPlayToggle}>
          <Image src={isPlaying ? PauseIcon : PlayIcon} alt="Play" height={26} />
        </button>
        <button className="cursor-pointer" onClick={onNextStep}>
          <Image src={ForwardIcon} alt="Forward" height={26} />
        </button>
        <button className="cursor-pointer" onClick={onFastForward}>
          <Image src={FastForwardIcon} alt="Fast Forward" height={26} />
        </button>
        <button className="cursor-pointer" onClick={onMuteToggle}>
          <Image src={isMuted ? MuteIcon : UnmuteIcon} alt="Mute" height={26} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
