//modules
import React, { useState } from 'react';
// import Image from 'next/image';
//components
import TitleBar from '../ui/TitleBar';
import GlassBridgeGame from '../glass-bridge-game';
//types
import { Character } from '@/types/character';
import { GamePlayStep } from '@/types/transcript';
//constants
// import { CHARACTER_AVATAR_MAP } from '@/constants/character';

interface GameplayPhaseProps {
  characters: Character[];
  isMuted: boolean;
  isPlaying: boolean;
  onMuteToggle: () => void;
  onPlayToggle: () => void;
  gamePlaySteps: GamePlayStep[];
}

const getInitialCharacterPositions = (characters: Character[]) => {
  const positions: Record<string, { position: number; direction: 'left' | 'right' }> = {};
  characters.forEach((character) => {
    positions[character.name] = { position: 0, direction: 'left' };
  });
  return positions;
};

const GameplayPhase = (props: GameplayPhaseProps) => {
  const { characters, isMuted, isPlaying, onMuteToggle, onPlayToggle, gamePlaySteps } = props;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [characterPositions, setCharacterPositions] = React.useState<
    Record<string, { position: number; direction: 'left' | 'right' }>
  >(getInitialCharacterPositions(characters));

  const changeCharacterPosition = (
    character: string,
    position: number,
    direction: 'left' | 'right'
  ) => {
    setCharacterPositions((prevPositions) => ({
      ...prevPositions,
      [character]: { position: prevPositions[character].position + position, direction },
    }));
  };

  const onNextStep = () => {
    changeCharacterPosition(
      gamePlaySteps[currentStepIndex].agent_id,
      1,
      gamePlaySteps[currentStepIndex].message_data.choice
    );
    setCurrentStepIndex((prevIndex) => Math.min(prevIndex + 1, gamePlaySteps.length - 1));
  };

  const onPreviousStep = () => {
    changeCharacterPosition(
      gamePlaySteps[currentStepIndex].agent_id,
      -1,
      gamePlaySteps[currentStepIndex].message_data.choice
    );
    setCurrentStepIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const onFastForward = () => {
    setCurrentStepIndex(gamePlaySteps.length - 1);
  };

  const onRewind = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex h-screen w-full flex-col space-y-8 overflow-auto bg-black p-8">
      <TitleBar
        onRewind={onRewind}
        onPreviousStep={onPreviousStep}
        onPlayToggle={onPlayToggle}
        onNextStep={onNextStep}
        onFastForward={onFastForward}
        onMuteToggle={onMuteToggle}
        isMuted={isMuted}
        isPlaying={isPlaying}
      />

      {/* Video Area */}
      <div className="flex w-full flex-1 items-center justify-around rounded-lg border border-[var(--neon-green)]">
        <GlassBridgeGame
          currentStepIndex={currentStepIndex}
          gamePlaySteps={gamePlaySteps}
          characterPositions={characterPositions}
        />
      </div>

      {/* Dialogue Section */}
      {/* <div className="flex rounded-lg border border-[var(--neon-green)] p-8"> */}
      {/* Character Avatar
        <Image
          src={CHARACTER_AVATAR_MAP[currentCharacter.name]}
          alt={currentCharacter.name}
          className="mr-8 max-h-64 w-64 rounded-lg border border-[var(--neon-green)] p-2"
        />

        <div className="max-h-64 flex-1 overflow-y-auto pr-2">
          <span className="font-['Press_Start_2P'] text-sm">{currentCharacter.name}:</span>
          <br />
          <p className="font-['Press_Start_2P'] text-xs">{currentCharacter.introduction}</p>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default GameplayPhase;
