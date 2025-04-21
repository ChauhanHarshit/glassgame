import {
  TranscriptItem,
  GameStateMessageData,
  IntroductionMessageData,
  GamePlayStep,
  ResponseMessageData,
} from '@/types/transcript';
import { Direction } from '@/types';
import { Character } from '@/types/character';

// Process transcript to extract character data for introduction phase
export const extractCharacters = (data: TranscriptItem[]): Character[] => {
  const characters: Character[] = [];

  for (const message of data) {
    // Stop when we hit the system message with all_acknowledged = true
    if (
      message.agent_id === 'system' &&
      'all_acknowledged' in message.message_data &&
      message.message_data.all_acknowledged === true
    ) {
      break;
    }

    // Filter only the valid character entries
    if (
      message.round_number === 1 &&
      message.message_type === 'response' &&
      message.agent_id !== 'system' &&
      'agent_name' in message.message_data &&
      'introduction' in message.message_data
    ) {
      const introData = message.message_data as IntroductionMessageData;
      characters.push({
        name: introData.agent_name || message.agent_id,
        introduction: introData.introduction,
        isAlive: true,
      });
    }
  }

  return characters;
};

// Process transcript to extract `id`, `agent_id`, and `message_data`
export const extractIdAgentMessageData = (data: TranscriptItem[]) => {
  const extractedData = [];

  for (const message of data) {
    // Extract relevant fields
    const { id, agent_id, message_data } = message;

    // Store only necessary fields: id, agent_id, and message_data
    extractedData.push({
      id,
      agent_id,
      message_data,
    });
  }

  return extractedData;
};

// Process the gameplay transcript to determine safe and unsafe tiles
export const processBridgeTiles = (
  gameplayTranscript: TranscriptItem[]
): {
  left: boolean[];
  right: boolean[];
} => {
  const bridgeLength = 16; // Based on the Figma design
  const leftTiles: boolean[] = Array(bridgeLength).fill(false);
  const rightTiles: boolean[] = Array(bridgeLength).fill(false);

  let currentPosition = 0;

  gameplayTranscript.forEach((item) => {
    if (item.message_type === 'game_state') {
      const gameStateData = item.message_data as GameStateMessageData;

      if (gameStateData.attempt_history && gameStateData.attempt_history.length > 0) {
        // Get the most recent attempt
        const latestAttempt =
          gameStateData.attempt_history[gameStateData.attempt_history.length - 1];

        if (
          latestAttempt &&
          latestAttempt.choice &&
          latestAttempt.result &&
          currentPosition < bridgeLength
        ) {
          const direction = latestAttempt.choice as Direction;
          const isSafe = latestAttempt.result === 'success';

          if (direction === 'left') {
            leftTiles[currentPosition] = isSafe;
          } else {
            rightTiles[currentPosition] = isSafe;
          }

          if (isSafe) {
            currentPosition++;
          }
        }
      }
    }
  });

  return { left: leftTiles, right: rightTiles };
};

export const getGamePlayStepsData = (gameplayTranscript: TranscriptItem[]): GamePlayStep[] => {
  const stepsData: GamePlayStep[] = [];

  gameplayTranscript.forEach((item) => {
    if (
      item.round_number === 2 &&
      item.agent_id !== 'system' &&
      item.message_type === 'response' &&
      item.id >= 1167
    ) {
      stepsData.push({
        agent_id: item.agent_id,
        message_data: item.message_data as ResponseMessageData,
      });
    }
  });
  return stepsData;
};
