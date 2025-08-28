import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActionCardProps {
  title: string;
  description?: string;
  icon?: string;
  status: 'pending' | 'active' | 'completed';
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  pending: {
    bgClass: 'bg-card',
    textClass: 'text-muted-foreground',
    buttonVariant: 'secondary' as const
  },
  active: {
    bgClass: 'bg-warning/10 border-warning',
    textClass: 'text-warning',
    buttonVariant: 'default' as const
  },
  completed: {
    bgClass: 'bg-success/10 border-success',
    textClass: 'text-success',
    buttonVariant: 'success' as const
  }
};

export const ActionCard = ({ 
  title, 
  description, 
  icon, 
  status, 
  onClick, 
  className 
}: ActionCardProps) => {
  const config = statusConfig[status];
  
  return (
    <Card className={`p-4 transition-all hover:shadow-md ${config.bgClass} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <span className="text-lg">{icon}</span>}
          <div>
            <h3 className={`font-medium ${config.textClass}`}>{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {onClick && (
          <Button 
            variant={config.buttonVariant}
            size="sm"
            onClick={onClick}
            disabled={status === 'completed'}
          >
            {status === 'completed' ? 'Done' : 'Execute'}
          </Button>
        )}
      </div>
    </Card>
  );
};