import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { ChatMessage } from '@/components/ChatMessage';
import { StatusBadge } from '@/components/StatusBadge';
import { VoiceWaveform } from '@/components/VoiceWaveform';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { Send, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}


export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Beacon AI. I\'m here to help you in any emergency situation. How can I assist you?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [emergencyLevel, setEmergencyLevel] = useState<'low' | 'medium' | 'high'>('low');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { 
    isVoiceActive, 
    isConnected, 
    isUserSpeaking, 
    isBotSpeaking, 
    startVoiceChat, 
    stopVoiceChat 
  } = useVoiceChat({
    onError: (error) => {
      console.error('Voice chat error:', error);
      addMessage(`Voice error: ${error}`, false);
    }
  });

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, true);

    // Mock API call to chat endpoint
    try {
      // Mock API endpoint - replace with actual backend URL
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: userMessage })
      // });
      
      // Mock AI response based on keywords
      setTimeout(() => {
        let response = '';
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
          response = 'I understand this is an emergency. I\'m immediately alerting emergency services and your emergency contacts. Stay calm and follow my instructions.';
          setEmergencyLevel('high');
        } else if (lowerMessage.includes('urgent') || lowerMessage.includes('problem')) {
          response = 'I\'m here to help with your urgent situation. Can you provide more details about what\'s happening?';
          setEmergencyLevel('medium');
        } else {
          response = 'Thank you for your message. I\'m here to assist you. Is this an emergency situation?';
        }
        
        addMessage(response, false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, I\'m having trouble connecting right now. Please try again.', false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    if (isVoiceActive) {
      stopVoiceChat();
    } else {
      startVoiceChat();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div>
            <h1 className="font-semibold text-foreground">Beacon Emergency Chat</h1>
            <p className="text-sm text-muted-foreground">AI-Powered Crisis Communication</p>
          </div>
        </div>
        <StatusBadge level={emergencyLevel} />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Voice Waveform */}
        {isVoiceActive && (
          <div className="bg-card border-b border-border p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                {isConnected ? 'Voice chat active' : 'Connecting to voice service...'}
              </p>
              {isUserSpeaking && (
                <p className="text-sm text-primary font-medium">You are speaking...</p>
              )}
              {isBotSpeaking && (
                <p className="text-sm text-accent font-medium">AI is responding...</p>
              )}
            </div>
            <VoiceWaveform 
              isActive={isVoiceActive}
              isUserSpeaking={isUserSpeaking}
              isBotSpeaking={isBotSpeaking}
            />
          </div>
        )}

        {/* Chat Area - Hidden during voice chat */}
        {!isVoiceActive && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-card border-t border-border p-4">
              <div className="flex gap-3">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or use voice recording..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Voice Button */}
      <Button
        variant="floating"
        size="floating"
        className="fixed bottom-6 right-6 z-50"
        onClick={handleVoiceToggle}
      >
        {isVoiceActive ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>

      {/* Voice Status Indicator */}
      {isVoiceActive && (
        <div className="fixed bottom-24 right-6 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Voice Active' : 'Connecting...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};