//modules
import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
//components
import TitleBar from '../ui/TitleBar';
//types
import { Character } from '@/types/character';
//constants
import { CHARACTER_AVATAR_MAP } from '@/constants/character';
//hooks
import  {play, pause, mute, unmute, changeTrack} from "../../store/slices/audioSlice"
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

interface IntroductionPhaseProps {
  characters: Character[];
  onNextPhase: () => void;
}

const IntroductionPhase = (props: IntroductionPhaseProps) => {
  const { characters, onNextPhase } = props;
  const dispatch = useAppDispatch()
  const audioState = useAppSelector((state) => state.audio)

  const [currentCharacterIndex, setCurrentCharacterIndex] = React.useState<number>(0);

  const currentCharacter = React.useMemo(
    () => characters[currentCharacterIndex],
    [characters, currentCharacterIndex]
  );

  // // Debug logging for state changes
  // React.useEffect(() => {
  //   console.log('State Update:', {
  //     currentCharacterIndex,
  //     currentCharacter: currentCharacter.name,
  //     ttsState: {
  //       isPlaying: tts.isPlaying,
  //       error: tts.error,
  //       isSupported: tts.isSupported,
  //       hasPermission: tts.hasPermission,
  //     }
  //   });
  // }, [currentCharacterIndex, currentCharacter, tts.isPlaying, tts.error, tts.isSupported, tts.hasPermission]);


  // Auto-play functionality
  useEffect(() => {
    // if (audioState.isPlaying && !tts.isPlaying) {
    //   const playIntroduction = async () => {
    //     try {
    //       const text = `${currentCharacter.name} says: ${currentCharacter.introduction}`;
    //       await tts.speak(text, {
    //         voice: 'heart',
    //         language: 'en-us',
    //         speakingRate: 1.0
    //       });
          
    //       if (currentCharacterIndex < characters.length - 1) {
    //         setCurrentCharacterIndex(prev => prev + 1);
    //       } else {
    //         dispatch(pause())
    //       }
    //     } catch (error) {
    //       console.error('Error playing audio:', error);
    //       dispatch(pause())
    //     }
    //   };

    //   playIntroduction();
    // }

    // choose aud
    dispatch(changeTrack("lol.mp3"))
    dispatch(play());
  }, []);

  const handleForwardClick = useCallback(() => {
    
  }, []);

  const handleBackwardClick = useCallback(() => {

  }, []);

  const onNextCharacter = useCallback(() => {
    console.log('Next character clicked');
    if (tts.isPlaying) {
      console.log('Stopping current audio');
      tts.stop();
    }
    setCurrentCharacterIndex(prev => Math.min(prev + 1, characters.length - 1));
  }, [characters.length]);

  const onPreviousCharacter = useCallback(() => {
    console.log('Previous character clicked');
    if (tts.isPlaying) {
      console.log('Stopping current audio');
      tts.stop();
    }
    setCurrentCharacterIndex(prev => Math.max(0, prev - 1));
  }, []);

  return (
    <div className="flex h-screen w-full flex-col space-y-8 overflow-auto bg-black p-8">
      <TitleBar
        onRewind={handleBackwardClick}
        onPreviousStep={onPreviousCharacter}
        onNextStep={onNextCharacter}
        onFastForward={handleForwardClick}
      />

      {/* Video Area */}
      <div className="flex w-full flex-1 items-center justify-around rounded-lg border border-[var(--neon-green)]">
        <div
          className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '50vh',
          }}
        >
          {/* Background image */}
          <div className="game-background"></div>

          {/* Pixelated overlay effect */}
          <div className="pixelated-overlay"></div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
            <h1 className="mb-8 text-5xl font-bold text-[var(--neon-green)]">
              Glass Bridge Challenge
            </h1>
            <p className="mb-8 max-w-md px-4 text-center text-[var(--neon-green)]">
              Choose the correct glass tile to cross the bridge. One tile is tempered and will hold
              your weight, the other will break. Use arrow keys or click to select.
            </p>
            
            {/* {tts.isSupported && !tts.hasPermission && (
              <p className="mb-4 text-yellow-500">
                Please grant permission for text-to-speech to hear character introductions.
              </p>
            )} */}
            {currentCharacterIndex === characters.length - 1 && (
              <button
                onClick={onNextPhase}
                className="rounded-md bg-[var(--neon-green)] px-8 py-4 text-xl font-bold text-black transition-colors hover:bg-[var(--neon-green-hover)]"
              >
                Start Game
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dialogue Section */}
      <div className="flex rounded-lg border border-[var(--neon-green)] p-8">
        {/* Character Avatar */}
        <div className="relative">
          <Image
            src={CHARACTER_AVATAR_MAP[currentCharacter.name]}
            alt={currentCharacter.name}
            className={cn(
              "mr-8 max-h-64 w-64 rounded-lg border border-[var(--neon-green)] p-2",
              "animate-pulse"
            )}
          />
          
            <div className="absolute bottom-4 right-4 flex items-center space-x-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--neon-green)] [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--neon-green)] [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--neon-green)]"></div>
            </div>
          
        </div>

        {/* Text Area */}
        <div className="max-h-64 flex-1 overflow-y-auto pr-2">
          <span className="font-['Press_Start_2P'] text-sm">{currentCharacter.name}:</span>
          <br />
          <p className="font-['Press_Start_2P'] text-xs">{currentCharacter.introduction}</p>
          {/* {tts.error && (
            <p className="mt-2 text-xs text-red-500">
              {tts.error.message === 'Speech synthesis permission not granted'
                ? 'Please grant permission for text-to-speech to hear character introductions.'
                : 'Error playing audio. Please try again.'}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default IntroductionPhase;
