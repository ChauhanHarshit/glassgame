export type TranscriptItem = {
  id: number;
  agent_id: string;
  game_id: string;
  game_type: string;
  round_number: number;
  message_data: MessageData;
  message_type: MessageType;
  timestamp: string;
};

export type MessageType = 'response' | 'game_state' | 'prompt';

export type IntroductionMessageData = {
  introduction: string;
  agent_name: string;
};

export type ResponseMessageData = {
  choice: 'left' | 'right';
  reasoning: string;
};

export type AttemptHistoryItem = {
  position: number;
  choice: 'left' | 'right';
  result: 'success' | 'failure';
};

export type AgentOrder = {
  [key: string]: number;
};

export type GameStateMessageData = {
  round: number;
  current_position: number;
  bridge_pattern: ('left' | 'right')[];
  attempt_history: AttemptHistoryItem[];
  eliminated_agents: string[];
  immune_agents: string[];
  active_agents: string[];
  agent_order: AgentOrder;
  ordering_phase: boolean;
};

export type PromptMessageData = {
  prompt: string;
};

export type MessageData =
  | IntroductionMessageData
  | ResponseMessageData
  | GameStateMessageData
  | PromptMessageData;

export type GamePlayStep = {
  type: 'choice';
  position: number;
  choice: 'left' | 'right';
  result: 'success' | 'failure';
  agent_id: string;
  timestamp: string;
  message_data: ResponseMessageData;
} | {
  type: 'game_state';
  bridge_pattern: boolean[];
  attempt_history: {
    position: number;
    choice: 'left' | 'right';
    result: 'success' | 'failure';
  }[];
  message_data: GameStateMessageData;
};
