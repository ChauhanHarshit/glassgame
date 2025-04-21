import { useState, useCallback, useEffect } from 'react';
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

interface TTSState {
  isPlaying: boolean;
  error: Error | null;
  queue: string[];
  isSupported: boolean;
  hasPermission: boolean;
  isApiAvailable: boolean;
}

export function useTTS() {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    error: null,
    queue: [],
    isSupported: false,
    hasPermission: false,
    isApiAvailable: true
  });

  // Keep track of the current sound
  const [currentSound, setCurrentSound] = useState<Howl | null>(null);

  // Check for TTS support and request permission
  useEffect(() => {
    const checkSupport = async () => {
      if (!window.speechSynthesis) {
        setState(prev => ({ ...prev, isSupported: false }));
        return;
      }

      try {
        // Request permission by trying to speak a short test
        const utterance = new SpeechSynthesisUtterance('');
        utterance.onerror = (event) => {
          console.log('TTS Permission Error:', event);
          setState(prev => ({ ...prev, isSupported: true, hasPermission: false }));
        };
        utterance.onend = () => {
          console.log('TTS Permission Granted');
          setState(prev => ({ ...prev, isSupported: true, hasPermission: true }));
        };
        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.cancel(); // Cancel the test utterance
      } catch (error) {
        console.error('TTS Support Check Error:', error);
        setState(prev => ({ ...prev, isSupported: false }));
      }
    };

    checkSupport();
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stop();
      }
      window.speechSynthesis?.cancel();
    };
  }, [currentSound]);

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    if (!LEMONFOX_API_KEY) {
      console.warn('Lemonfox API key not found. Using browser TTS fallback.');
      return useBrowserTTS(text, state.hasPermission);
    }

    try {
      setState(prev => ({ ...prev, isPlaying: true, error: null }));

      console.log('Making TTS request to:', LEMONFOX_API_URL);
      const response = await fetch(LEMONFOX_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LEMONFOX_API_KEY}`,
        },
        body: JSON.stringify({
          input: text,
          voice: options.voice || 'heart',
          language: options.language || 'en-us',
          response_format: options.responseFormat || 'mp3',
          speed: options.speakingRate || 1.0,
          word_timestamps: false
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lemonfox API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 429 || response.status === 503) {
          setState(prev => ({ ...prev, isApiAvailable: false }));
          return useBrowserTTS(text, state.hasPermission);
        }
        
        throw new Error(`Lemonfox API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return new Promise<void>((resolve, reject) => {
        const sound = new Howl({
          src: [audioUrl],
          format: ['mp3'],
          html5: true,
          onend: () => {
            URL.revokeObjectURL(audioUrl);
            setState(prev => ({ ...prev, isPlaying: false }));
            setCurrentSound(null);
            resolve();
          },
          onloaderror: (_, error) => {
            URL.revokeObjectURL(audioUrl);
            setState(prev => ({
              ...prev,
              isPlaying: false,
              error: new Error(`Failed to load audio: ${error}`),
            }));
            setCurrentSound(null);
            reject(error);
          },
          onplayerror: (_, error) => {
            URL.revokeObjectURL(audioUrl);
            setState(prev => ({
              ...prev,
              isPlaying: false,
              error: new Error(`Failed to play audio: ${error}`),
            }));
            setCurrentSound(null);
            reject(error);
          },
        });

        setCurrentSound(sound);
        sound.play();
      });
    } catch (error) {
      console.error('TTS Error:', error);
      setState(prev => ({
        ...prev,
        isPlaying: false,
        error: error instanceof Error ? error : new Error('Unknown TTS error'),
      }));

      // Try browser fallback
      return useBrowserTTS(text, state.hasPermission);
    }
  }, [state.hasPermission, state.isApiAvailable]);

  const stop = useCallback(() => {
    if (currentSound) {
      currentSound.stop();
      setCurrentSound(null);
    }
    window.speechSynthesis?.cancel();
    setState(prev => ({ ...prev, isPlaying: false, queue: [] }));
  }, [currentSound]);

  const queueSpeak = useCallback((text: string, options: TTSOptions = {}) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, text],
    }));

    if (!state.isPlaying) {
      speak(text, options);
    }
  }, [speak, state.isPlaying]);

  return {
    speak,
    queueSpeak,
    stop,
    isPlaying: state.isPlaying,
    error: state.error,
    hasQueue: state.queue.length > 0,
    isSupported: state.isSupported,
    hasPermission: state.hasPermission,
    isApiAvailable: state.isApiAvailable
  };
}

// Browser TTS fallback
function useBrowserTTS(text: string, hasPermission: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Browser does not support speech synthesis'));
      return;
    }

    if (!hasPermission) {
      // Try to request permission by speaking a short test
      const testUtterance = new SpeechSynthesisUtterance('');
      testUtterance.onend = () => {
        // If we get here, permission was granted
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => resolve();
        utterance.onerror = (event) => {
          if (event.error === 'not-allowed') {
            reject(new Error('Speech synthesis permission not granted'));
          } else {
            reject(event);
          }
        };
        window.speechSynthesis.speak(utterance);
      };
      testUtterance.onerror = () => {
        reject(new Error('Speech synthesis permission not granted'));
      };
      window.speechSynthesis.speak(testUtterance);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      if (event.error === 'not-allowed') {
        reject(new Error('Speech synthesis permission not granted'));
      } else {
        reject(event);
      }
    };
    window.speechSynthesis.speak(utterance);
  });
} 