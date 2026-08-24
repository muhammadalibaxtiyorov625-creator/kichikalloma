import { useState, useRef, useEffect } from 'react';

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop currently playing audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Play audio from a URL
  const playAudio = (url: string) => {
    // If the same URL is playing, pause it
    if (currentUrl === url && isPlaying) {
      stopAudio();
      return;
    }

    // Stop current audio if playing a new one
    if (isPlaying) {
      stopAudio();
    }

    setCurrentUrl(url);
    setIsPlaying(true);

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    } else {
      audioRef.current.src = url;
    }

    // Auto-play the audio
    audioRef.current.play().catch((err) => {
      console.error("Audio ijro etishda xatolik:", err);
      setIsPlaying(false);
    });

    // Handle end of audio
    audioRef.current.onended = () => {
      setIsPlaying(false);
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    playAudio,
    stopAudio,
    isPlaying,
    currentUrl,
  };
}
