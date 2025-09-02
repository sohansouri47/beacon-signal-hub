// import { useState, useRef, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Logo } from '@/components/Logo';
// import { ChatMessage } from '@/components/ChatMessage';
// import { StatusBadge } from '@/components/StatusBadge';
// import { VoiceWaveform } from '@/components/VoiceWaveform';
// import { useVoiceChat } from '@/hooks/useVoiceChat';
// import { Send, Mic, MicOff } from 'lucide-react';

// interface Message {
//   id: string;
//   text: string;
//   isUser: boolean;
//   timestamp: Date;
// }


// export const Chat = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       text: 'Hello! I\'m Beacon AI. I\'m here to help you in any emergency situation. How can I assist you?',
//       isUser: false,
//       timestamp: new Date()
//     }
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [emergencyLevel, setEmergencyLevel] = useState<'low' | 'medium' | 'high'>('low');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const { 
//     isVoiceActive, 
//     isConnected, 
//     isUserSpeaking, 
//     isBotSpeaking, 
//     startVoiceChat, 
//     stopVoiceChat 
//   } = useVoiceChat({
//     onError: (error) => {
//       console.error('Voice chat error:', error);
//       addMessage(`Voice error: ${error}`, false);
//     }
//   });

//   const addMessage = (text: string, isUser: boolean) => {
//     const newMessage: Message = {
//       id: Date.now().toString(),
//       text,
//       isUser,
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, newMessage]);
//   };
// const handleSendMessage = async () => {
//   if (!inputText.trim()) return;

//   const userMessage = inputText.trim();
//   setInputText('');
//   addMessage(userMessage, true);

//   try {
//     const payload = {
//       context_id: "12345", 
//       user_id: "user_001", 
//       user_prompt: userMessage,
//     };
//     console.log("Sending payload:", payload);

//     const response = await fetch(
//       `${import.meta.env.VITE_BACKEND_URL}/chat`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       }
//     );

//     const data = await response.json();
//     console.log("Response:", data);

//     if (!response.ok) {
//       throw new Error(JSON.stringify(data));
//     }

//     if (data.emergencyLevel) {
//       setEmergencyLevel(data.emergencyLevel);
//     }

//     addMessage(data.response, false);
//   } catch (error) {
//     console.error('Error sending message:', error);
//     addMessage(
//       "Sorry, I'm having trouble connecting right now. Please try again.",
//       false
//     );
//   }
// };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleVoiceToggle = () => {
//     if (isVoiceActive) {
//       stopVoiceChat();
//     } else {
//       startVoiceChat();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       {/* Header */}
//       <header className="bg-card border-b border-border p-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Logo size="md" />
//           <div>
//             <h1 className="font-semibold text-foreground">Beacon Emergency Chat</h1>
//             <p className="text-sm text-muted-foreground"></p>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Voice Waveform */}
//         {isVoiceActive && (
//           <div className="bg-card border-b border-border p-6">
//             <div className="text-center mb-4">
//               <p className="text-sm text-muted-foreground">
//                 {isConnected ? 'Voice chat active' : 'Connecting to voice service...'}
//               </p>
//               {isUserSpeaking && (
//                 <p className="text-sm text-primary font-medium">You are speaking...</p>
//               )}
//               {isBotSpeaking && (
//                 <p className="text-sm text-accent font-medium">Beacon is responding...</p>
//               )}
//             </div>
//             <VoiceWaveform 
//               isActive={isVoiceActive}
//               isUserSpeaking={isUserSpeaking}
//               isBotSpeaking={isBotSpeaking}
//             />
//           </div>
//         )}

//         {/* Chat Area - Hidden during voice chat */}
//         {!isVoiceActive && (
//           <>
//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {messages.map((message) => (
//                 <ChatMessage
//                   key={message.id}
//                   message={message.text}
//                   isUser={message.isUser}
//                   timestamp={message.timestamp}
//                 />
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area */}
//             <div className="bg-card border-t border-border p-4">
//               <div className="flex gap-3">
//                 <Input
//                   value={inputText}
//                   onChange={(e) => setInputText(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type your message or use voice recording..."
//                   className="flex-1"
//                 />
//                 <Button onClick={handleSendMessage} disabled={!inputText.trim()}>
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Floating Voice Button */}
//       <Button
//         variant="floating"
//         size="floating"
//         className="fixed bottom-2 right-6"
//         onClick={handleVoiceToggle}
//       >
//         {isVoiceActive ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
//       </Button>

//       {/* Voice Status Indicator */}
//       {isVoiceActive && (
//         <div className="fixed bottom-24 right-6 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
//             <span className="text-sm font-medium">
//               {isConnected ? 'Voice Active' : 'Connecting...'}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { ChatMessage } from '@/components/ChatMessage';
import { VoiceWaveform } from '@/components/VoiceWaveform';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { Send, Mic, MicOff } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";

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

  const [user, setUser] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      console.log(storedUser)
      if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser?.userId) {
          const uniqueSessionId = `${parsedUser.userId}-${uuidv4()}`;
          setSessionId(uniqueSessionId);
        }
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }
    }, []);
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

    try {
      const payload = {
        context_id:sessionId, 
        user_id:user?.userId, 
        user_prompt: userMessage,
      };
      console.log("Sending payload:", payload);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      if (data.emergencyLevel) {
        setEmergencyLevel(data.emergencyLevel);
      }

      addMessage(data.response, false);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage(
        "Sorry, I'm having trouble connecting right now. Please try again.",
        false
      );
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
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <div>
            <h1 className="font-semibold text-foreground">Beacon Emergency Chat</h1>
            <p className="text-sm text-muted-foreground"></p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Voice Waveform - Only shown during voice chat */}
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
                <p className="text-sm text-accent font-medium">Beacon is responding...</p>
              )}
            </div>
            <VoiceWaveform 
              isActive={isVoiceActive}
              isUserSpeaking={isUserSpeaking}
              isBotSpeaking={isBotSpeaking}
            />
          </div>
        )}

        {/* Messages - Hidden during voice chat */}
        {!isVoiceActive && (
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
        )}

        {/* Input Area - Hidden during voice chat */}
        {!isVoiceActive && (
          <div className="bg-card border-t border-border p-4">
            <div className="flex gap-3">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or use voice recording..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleVoiceToggle}
                variant="secondary"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Voice Toggle Button - Fixed at bottom during voice chat */}
      {isVoiceActive && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={handleVoiceToggle}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 shadow-lg"
            size="lg"
          >
            <MicOff className="h-4 w-4 mr-2" />
            Stop Voice Chat
          </Button>
        </div>
      )}

      {/* Voice Status Indicator - Only shown during voice chat */}
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