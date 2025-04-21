export type GamePlayStep = {
  type: 'choice';
  position: number;
  choice: 'left' | 'right';
  result: 'success' | 'failure';
  agent_id: string;
  timestamp: string;
} | {
  type: 'game_state';
  bridge_pattern: boolean[];
  attempt_history: {
    position: number;
    choice: 'left' | 'right';
    result: 'success' | 'failure';
  }[];
}; 