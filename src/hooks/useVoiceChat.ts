import { useState, useRef, useCallback } from "react";

interface UseVoiceChatOptions {
  onError?: (error: string) => void;
  onTranscription?: (text: string) => void;
  onResponse?: (text: string) => void;
}

export const useVoiceChat = ({
  onError,
  onTranscription,
  onResponse,
}: UseVoiceChatOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [lastTranscription, setLastTranscription] = useState("");

  const websocketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convert Float32 → Int16 PCM
  const floatTo16BitPCM = (float32Array: Float32Array): Int16Array => {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm16;
  };

  // Simple resampler to 16kHz
  const resampleTo16kHz = (
    buffer: Float32Array,
    currentSampleRate: number
  ): Float32Array => {
    if (currentSampleRate === 16000) return buffer;
    const ratio = currentSampleRate / 16000;
    const newLength = Math.floor(buffer.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      result[i] = buffer[Math.floor(i * ratio)];
    }
    return result;
  };

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    const wsUrl =
      import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8000/voice";

    try {
      websocketRef.current = new WebSocket(wsUrl);
      websocketRef.current.binaryType = "arraybuffer";

      websocketRef.current.onopen = () => {
        setIsConnected(true);
        console.log("✅ Connected to voice WebSocket");
      };

      websocketRef.current.onmessage = async (event) => {
        try {
          if (!audioContextRef.current) return;

          if (typeof event.data === "string") {
            // Handle text messages
            const message = event.data;
            console.log("📩 Server message:", message);

            if (message.startsWith("TRANSCRIPT:")) {
              const transcript = message.replace("TRANSCRIPT:", "").trim();
              setLastTranscription(transcript);
              onTranscription?.(transcript);
            } else if (message.startsWith("RESPONSE:")) {
              const response = message.replace("RESPONSE:", "").trim();
              onResponse?.(response);
            } else if (
              message.startsWith("ERROR:") ||
              message.startsWith("TRANSCRIPTION_ERROR:")
            ) {
              const error = message.split(":").slice(1).join(":").trim();
              console.error("❌ Server error:", error);
              onError?.(error);
            }
            return;
          }

          // Handle binary audio chunks (bot voice playback)
          const buf = event.data as ArrayBuffer;
          let float32: Float32Array;
          if (buf.byteLength % 2 === 0) {
            const int16 = new Int16Array(buf);
            float32 = new Float32Array(int16.length);
            for (let i = 0; i < int16.length; i++) {
              float32[i] = int16[i] / 32768;
            }
          } else {
            float32 = new Float32Array(buf);
          }

          const ac = audioContextRef.current;
          const audioBuffer = ac.createBuffer(1, float32.length, 16000);
          audioBuffer.copyToChannel(float32, 0);

          const source = ac.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ac.destination);
          source.start();

          setIsBotSpeaking(true);
          source.onended = () => setIsBotSpeaking(false);
        } catch (err) {
          console.error("Playback error:", err);
          onError?.("Audio playback failed");
        }
      };

      websocketRef.current.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        onError?.("Voice service connection error");
      };

      websocketRef.current.onclose = (event) => {
        setIsConnected(false);
        console.log(`🔌 WebSocket closed (code: ${event.code})`);
      };
    } catch (err) {
      console.error("❌ WebSocket creation error:", err);
      onError?.("Failed to create WebSocket connection");
    }
  }, [onError, onTranscription, onResponse]);

  // Start voice chat
  const startVoiceChat = useCallback(async () => {
    try {
      const ac = new AudioContext();
      audioContextRef.current = ac;
      console.log(`🎧 Audio context sample rate: ${ac.sampleRate}Hz`);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });
      streamRef.current = stream;

      const source = ac.createMediaStreamSource(stream);

      await ac.audioWorklet.addModule("/pcm-processor.js");
      const workletNode = new AudioWorkletNode(ac, "pcm-processor");

      workletNode.port.onmessage = (event) => {
        if (!(event.data instanceof Float32Array)) return;

        const resampled = resampleTo16kHz(event.data, ac.sampleRate);
        const pcm16 = floatTo16BitPCM(resampled);

        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          websocketRef.current.send(pcm16.buffer);
        }

        // 🎤 Energy-based speaking detection with debounce
        const energy =
          resampled.reduce((sum, sample) => sum + sample * sample, 0) /
          resampled.length;

        if (energy > 0.0015) {
          setIsUserSpeaking(true);
          if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
          }
          speakingTimeoutRef.current = setTimeout(() => {
            setIsUserSpeaking(false);
          }, 300); // stay "speaking" for 300ms after silence
        }
      };

      source.connect(workletNode);

      connectWebSocket();
      setIsVoiceActive(true);
      console.log("🎙️ Voice chat started successfully");
    } catch (err: any) {
      console.error("❌ Voice initialization error:", err);
      onError?.(`Unable to start voice chat: ${err.message}`);
    }
  }, [connectWebSocket, onError]);

  const stopVoiceChat = useCallback(() => {
    try {
      websocketRef.current?.close();
      websocketRef.current = null;

      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      audioContextRef.current?.close();
      audioContextRef.current = null;

      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = null;
      }

      setIsVoiceActive(false);
      setIsConnected(false);
      setIsUserSpeaking(false);
      setIsBotSpeaking(false);

      console.log("🛑 Voice chat stopped");
    } catch (err) {
      console.error("❌ Error stopping voice chat:", err);
    }
  }, []);

  return {
    isVoiceActive,
    isConnected,
    isUserSpeaking,
    isBotSpeaking,
    lastTranscription,
    startVoiceChat,
    stopVoiceChat,
  };
};
