import { useState, useCallback, useEffect, useRef } from 'react';
import  {play, pause, mute, unmute, changeTrack, useTypedSelector} from "../store/slices/audioSlice"
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from "../store/store"
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const LEMONFOX_API_KEY = process.env.NEXT_PUBLIC_LEMONFOX_API_KEY || '';
const LEMONFOX_API_URL = 'https://api.lemonfox.ai/v1/audio/speech';

async function convertTextToMp3(
  text: string,
  signal?: AbortSignal,
  options: {
    voice?: string;
    language?: string;
    responseFormat?: string;
    speakingRate?: number;
  } = {}
): Promise<string> {
  const requestBody = {
    input: text,
    voice: options.voice || 'heart',
    language: options.language || 'en-us',
    response_format: options.responseFormat || 'mp3',
    speed: options.speakingRate || 1.0,
    word_timestamps: false
  };

  const response = await fetch(LEMONFOX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LEMONFOX_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lemonfox API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Lemonfox API error: ${response.statusText}`);
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

export function useTTS() {
  const dispatch = useDispatch();
  const { currText, isPlaying, isMuted } = useTypedSelector((state: RootState) => state.audio);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle text changes and audio fetching
  useEffect(() => {
    if (!currText) return;

    const fetchAudio = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const mp3Url = await convertTextToMp3(currText, abortControllerRef.current.signal);

        // Clean up previous audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('ended', handleEnded);
        }

        // Create new audio element
        const newAudio = new Audio(mp3Url);
        audioRef.current = newAudio;

        // Set initial state
        newAudio.muted = isMuted;
        if (isPlaying) {
          await newAudio.play();
        }

        // Add event listeners
        newAudio.addEventListener('ended', handleEnded);
        newAudio.addEventListener('play', handlePlay);
        newAudio.addEventListener('pause', handlePause);

      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load audio');
          dispatch(pause());
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudio();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [currText]);

  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        setError('Playback failed. Click to retry.');
        dispatch(pause());
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle mute state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
      }
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleEnded = () => {
    dispatch(pause());
  };

  const handlePlay = () => {
    dispatch(play());
  };

  const handlePause = () => {
    dispatch(pause());
  };

  return {
    isLoading,
    error,
    retry: () => {
      setError(null);
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          setError('Playback failed. Please interact with the page first.');
        });
      }
    }
  };
}