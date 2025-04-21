import axios from 'axios';
import { GetTranscriptResponse } from './type';

// API endpoint for the game transcript
const TRANSCRIPT_API_GAMEPLAY_URL =
  'https://sentient-struggle-season0-ovv7g.ondigitalocean.app/db/games/3c6ffc89-dffc-479b-860e-c4bee92f4f02/conversation?sort_by=timestamp&sort_order=asc&limit=10000&offset=0';

// Function to fetch transcript from API
export const getTranscript = async (): Promise<GetTranscriptResponse> => {
  const response = await axios.get(TRANSCRIPT_API_GAMEPLAY_URL);
  return response.data;
};
