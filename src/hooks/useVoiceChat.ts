import { useState, useRef, useCallback } from "react";

interface UseVoiceChatOptions {
  onError?: (error: string) => void;
}

export const useVoiceChat = ({ onError }: UseVoiceChatOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);

  const websocketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // PCM Float32 → Int16 conversion
  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    float32Array.forEach((sample, i) => {
      const s = Math.max(-1, Math.min(1, sample));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    });
    return buffer;
  };

  // Establish WebSocket and handle incoming messages
  const connectWebSocket = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
    websocketRef.current = new WebSocket(wsUrl);
    websocketRef.current.binaryType = "arraybuffer";

    websocketRef.current.onopen = () => {
      setIsConnected(true);
      console.log("Connected to voice WebSocket");
    };

    websocketRef.current.onmessage = async (event) => {
      try {
        if (!audioContextRef.current) return;

        if (typeof event.data === "string") {
          console.log("Text from server:", event.data);
          return;
        }

        const buf = event.data as ArrayBuffer;

        // Attempt both formats: int16 and float32
        let float32: Float32Array;
        if (buf.byteLength % 2 === 0) {
          const int16 = new Int16Array(buf);
          float32 = new Float32Array(int16.length);
          for (let i = 0; i < int16.length; i++) {
            float32[i] = int16[i] / 32768;
          }
        } else if (buf.byteLength % 4 === 0) {
          float32 = new Float32Array(buf);
        } else {
          console.error("Unexpected audio chunk size:", buf.byteLength);
          return;
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
      console.error("WebSocket error:", err);
      onError?.("Voice service connection error");
    };

    websocketRef.current.onclose = () => {
      setIsConnected(false);
      console.log("Voice WebSocket closed");
    };
  }, [onError]);

  // Start capturing mic and streaming raw PCM
  const startVoiceChat = useCallback(async () => {
    try {
      const ac = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = ac;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const source = ac.createMediaStreamSource(stream);
      await ac.audioWorklet.addModule("/pcm-processor.js");
      const workletNode = new AudioWorkletNode(ac, "pcm-processor");

      workletNode.port.onmessage = (event) => {
        if (
          websocketRef.current?.readyState === WebSocket.OPEN &&
          event.data instanceof Float32Array
        ) {
          const pcm16 = floatTo16BitPCM(event.data);
          websocketRef.current.send(pcm16);
        }
      };

      source.connect(workletNode);
      connectWebSocket();
      setIsVoiceActive(true);
      console.log("Started voice chat");
    } catch (err) {
      console.error("Voice init error:", err);
      onError?.("Unable to start voice chat");
    }
  }, [connectWebSocket, onError]);

  const stopVoiceChat = useCallback(() => {
    websocketRef.current?.close();
    audioContextRef.current?.close();
    setIsVoiceActive(false);
    setIsConnected(false);
    setIsUserSpeaking(false);
    setIsBotSpeaking(false);
    console.log("Stopped voice chat");
  }, []);

  return {
    isVoiceActive,
    isConnected,
    isUserSpeaking,
    isBotSpeaking,
    startVoiceChat,
    stopVoiceChat,
  };
};
