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

import  {play, pause, mute, unmute, changeTrack} from "../../store/slices/audioSlice"
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

interface TitleBarProps {
  onRewind: () => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onFastForward: () => void;
}

const TitleBar = (props: TitleBarProps) => {
  const {
    onRewind,
    onPreviousStep,
    onNextStep,
    onFastForward,
  } = props;

  const dispatch = useAppDispatch()
  const audioState = useAppSelector((state) => state.audio)

  return (
    <div className="flex items-center gap-8">
      <Image src={GameIcon} alt="Game Icon" width={68} height={56} />

      <span className="flex h-full flex-1 items-center rounded-lg border border-[var(--neon-green)] p-3 font-['Press_Start_2P'] text-lg">
        Welcome To Sentient Struggle
      </span>

      {/* PLayer */}
      <div className="flex items-center space-x-4">
        <button className="rotate-180 cursor-pointer" onClick={onRewind}>
          <Image src={FastForwardIcon} alt="Fast Forward" height={26} />
        </button>
        <button className="cursor-pointer" onClick={onFastForward}>
          <Image src={FastForwardIcon} alt="Fast Forward" height={26} />
        </button>
        <button className="rotate-180 cursor-pointer" onClick={onPreviousStep}>
          <Image src={ForwardIcon} alt="Forward" height={26} />
        </button>
        <button className="cursor-pointer" onClick={() => audioState.isPlaying ? dispatch(pause()) : dispatch(play())}>
        <Image src={audioState.isPlaying ? PauseIcon : PlayIcon} alt="Play" height={26} />
      </button>
      <button className="cursor-pointer" onClick={onNextStep}>
        <Image src={ForwardIcon} alt="Forward" height={26} />
      </button>
      
      <button className="cursor-pointer" onClick={() => audioState.isMuted ? dispatch(unmute()) : dispatch(mute())}>
        <Image src={audioState.isMuted ? MuteIcon : UnmuteIcon} alt="Mute" height={26} />
      </button>
      <audio></audio>
    </div>
    </div >
  );
};

export default TitleBar;
