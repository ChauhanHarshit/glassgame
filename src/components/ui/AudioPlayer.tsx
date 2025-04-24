// AudioPlayer.tsx
import React from 'react';
import Image from 'next/image';

import ForwardIcon from '@/assets/forward.svg';
import FastForwardIcon from '@/assets/fast_forward.svg';
import MuteIcon from '@/assets/mute.svg';
import UnmuteIcon from '@/assets/unmute.svg';
import PlayIcon from '@/assets/play.svg';
import PauseIcon from '@/assets/pause.svg';

import { play, pause, mute, unmute } from '../../store/slices/audioSlice';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


const AudioPlayer = () => {
  const dispatch = useAppDispatch();
  const audioState = useAppSelector((state: RootState) => state.audio);

  return (
    <div className="flex items-center space-x-4">
      <button className="rotate-180 cursor-pointer" onClick={onRewind}>
        <Image src={FastForwardIcon} alt="Rewind" height={26} />
      </button>
      <button className="cursor-pointer" onClick={onFastForward}>
        <Image src={FastForwardIcon} alt="Fast Forward" height={26} />
      </button>
      <button className="rotate-180 cursor-pointer" onClick={onPreviousStep}>
        <Image src={ForwardIcon} alt="Previous" height={26} />
      </button>
      <button className="cursor-pointer" onClick={() => audioState.isPlaying ? dispatch(pause()) : dispatch(play())}>
        <Image src={audioState.isPlaying ? PauseIcon : PlayIcon} alt="Play/Pause" height={26} />
      </button>
      <button className="cursor-pointer" onClick={onNextStep}>
        <Image src={ForwardIcon} alt="Next" height={26} />
      </button>
      <button className="cursor-pointer" onClick={() => audioState.isMuted ? dispatch(unmute()) : dispatch(mute())}>
        <Image src={audioState.isMuted ? MuteIcon : UnmuteIcon} alt="Mute/Unmute" height={26} />
      </button>
    </div>
  );
};

export default AudioPlayer;
