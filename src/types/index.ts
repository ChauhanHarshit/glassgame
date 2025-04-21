export interface Character {
  id: number;
  name: string;
  avatar?: string;
  introduction: string;
  isAlive: boolean;
}

export interface GameState {
  phase: 'introduction' | 'gameplay' | 'results';
  characters: Character[];
  currentCharacterIndex: number;
  currentTranscriptIndex: number;
  bridgeState: {
    length: number;
    currentPosition: number;
    tiles: {
      left: boolean[];
      right: boolean[];
    };
  };
  isAudioPlaying: boolean;
}

export type Direction = 'left' | 'right';
