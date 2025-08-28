import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  className?: string;
}

export const ChatMessage = ({ message, isUser, timestamp, className }: ChatMessageProps) => {
  return (
    <div className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start', className)}>
      <div 
        className={cn(
          'max-w-[70%] rounded-lg px-4 py-2 text-sm',
          isUser 
            ? 'bg-chat-user-bg text-chat-user-fg ml-auto' 
            : 'bg-chat-bot-bg text-chat-bot-fg mr-auto'
        )}
      >
        <p className="break-words">{message}</p>
        {timestamp && (
          <p className="text-xs opacity-70 mt-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
};