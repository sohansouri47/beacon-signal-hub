import { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  isUserSpeaking: boolean;
  isBotSpeaking: boolean;
}

export const VoiceWaveform = ({ isActive, isUserSpeaking, isBotSpeaking }: VoiceWaveformProps) => {
  const [bars, setBars] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    if (!isActive) {
      setBars(Array(20).fill(0));
      return;
    }

    const interval = setInterval(() => {
      if (isUserSpeaking || isBotSpeaking) {
        // Animate bars with random heights when speaking
        setBars(prev => prev.map(() => Math.random() * 100));
      } else {
        // Gentle idle animation
        setBars(prev => prev.map(() => Math.random() * 20));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isUserSpeaking, isBotSpeaking]);

  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center h-32 space-x-1">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-2 transition-all duration-100 ease-out rounded-full ${
            isUserSpeaking 
              ? 'bg-primary' 
              : isBotSpeaking 
                ? 'bg-accent' 
                : 'bg-muted-foreground/40'
          }`}
          style={{
            height: `${Math.max(4, height)}%`,
          }}
        />
      ))}
    </div>
  );
};