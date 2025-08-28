import { useState, useRef, useCallback } from 'react';

interface UseVoiceChatOptions {
  onError?: (error: string) => void;
}

export const useVoiceChat = ({ onError }: UseVoiceChatOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const websocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      // Replace with your actual WebSocket URL
      const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001/voice';
      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Voice WebSocket connected');
      };

      websocketRef.current.onmessage = async (event) => {
        // Handle incoming audio from backend
        if (event.data instanceof Blob) {
          setIsBotSpeaking(true);
          
          // Play received audio
          const arrayBuffer = await event.data.arrayBuffer();
          if (audioContextRef.current) {
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();
            
            source.onended = () => {
              setIsBotSpeaking(false);
            };
          }
        }
      };

      websocketRef.current.onclose = () => {
        setIsConnected(false);
        console.log('Voice WebSocket disconnected');
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.('Failed to connect to voice service');
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      onError?.('Failed to initialize voice connection');
    }
  }, [onError]);

  const startVoiceChat = useCallback(async () => {
    try {
      // Initialize audio context
      audioContextRef.current = new AudioContext();
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && websocketRef.current?.readyState === WebSocket.OPEN) {
          // Send audio data to backend
          websocketRef.current.send(event.data);
        }
      };

      // Connect WebSocket and start recording
      connectWebSocket();
      
      // Start recording in chunks
      mediaRecorderRef.current.start(100); // Send data every 100ms
      setIsVoiceActive(true);
      
      // Detect speech activity (simplified)
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const detectSpeech = () => {
        if (!isVoiceActive) return;
        
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        setIsUserSpeaking(average > 20); // Threshold for speech detection
        
        requestAnimationFrame(detectSpeech);
      };
      
      detectSpeech();
      
    } catch (error) {
      console.error('Voice chat error:', error);
      onError?.('Failed to start voice chat. Please check microphone permissions.');
    }
  }, [connectWebSocket, onError, isVoiceActive]);

  const stopVoiceChat = useCallback(() => {
    // Stop recording
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Close WebSocket
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.close();
    }

    // Close audio context
    if (audioContextRef.current?.state === 'running') {
      audioContextRef.current.close();
    }

    setIsVoiceActive(false);
    setIsUserSpeaking(false);
    setIsBotSpeaking(false);
    setIsConnected(false);
  }, []);

  return {
    isVoiceActive,
    isConnected,
    isUserSpeaking,
    isBotSpeaking,
    startVoiceChat,
    stopVoiceChat
  };
};