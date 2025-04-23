import { Howl } from 'howler';

const LEMONFOX_API_KEY = process.env.NEXT_PUBLIC_LEMONFOX_API_KEY || '';
const LEMONFOX_API_URL = 'https://api.lemonfox.ai/v1/audio/speech';

interface TTSOptions {
  voice?: string;
  speakingRate?: number;
  pitch?: number;
  language?: string;
  responseFormat?: string;
}

// interface TTSState {
//   isPlaying: boolean;
//   error: Error | null;
//   queue: string[];
//   isSupported: boolean;
//   hasPermission: boolean;
//   isApiAvailable: boolean;
// }
// const textToSpeech = async (text: string, options: TTSOptions = {}) => {
//     try {
//       setState(prev => ({ ...prev, isPlaying: true, error: null }));

//       console.log('Making TTS request to:', LEMONFOX_API_URL);
//       const response = await fetch(LEMONFOX_API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${LEMONFOX_API_KEY}`,
//         },
//         body: JSON.stringify({
//           input: text,
//           voice: options.voice || 'heart',
//           language: options.language || 'en-us',
//           response_format: options.responseFormat || 'mp3',
//           speed: options.speakingRate || 1.0,
//           word_timestamps: false
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Lemonfox API Error:', {
//           status: response.status,
//           statusText: response.statusText,
//           body: errorText
//         });
        
//         throw new Error(`Lemonfox API error: ${response.statusText}`);
//       }
//     }
// });