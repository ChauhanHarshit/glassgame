const LEMONFOX_API_KEY = 'VqNRj21xOmd9DUQtHlgOvE41joQRFtdZ';
const LEMONFOX_API_URL = 'https://api.lemonfox.ai/v1/text-to-speech';

// Keep track of the current audio element
let currentAudio: HTMLAudioElement | null = null;

export async function textToSpeech(text: string, isMuted: boolean = false): Promise<void> {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // If muted, resolve immediately
  if (isMuted) {
    return Promise.resolve();
  }

  try {
    const response = await fetch(LEMONFOX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LEMONFOX_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        voice: 'en-US-Standard-C', // You can change this to other voices
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Text-to-speech API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve();
      };

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        reject(error);
      };

      // Start playing
      audio.play().catch((error) => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw error; // Re-throw to let the caller handle it
  }
}

// Function to stop any currently playing audio
export function stopTextToSpeech(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
} 