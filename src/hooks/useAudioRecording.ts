import { useState, useRef, useCallback } from 'react';

interface UseAudioRecordingOptions {
  onRecordingComplete?: (audioBlob: Blob) => void;
  maxDuration?: number; // in milliseconds
}

export const useAudioRecording = ({ 
  onRecordingComplete, 
  maxDuration = 300000 // 5 minutes default
}: UseAudioRecordingOptions = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete?.(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      
      // Start timer
      timeIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1000;
          if (newTime >= maxDuration) {
            stopRecording();
            return prev;
          }
          return newTime;
        });
      }, 1000);
      
    } catch (err) {
      setError('Failed to access microphone. Please ensure microphone permissions are granted.');
      console.error('Audio recording error:', err);
    }
  }, [onRecordingComplete, maxDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    isRecording,
    recordingTime: formatTime(recordingTime),
    error,
    startRecording,
    stopRecording
  };
};