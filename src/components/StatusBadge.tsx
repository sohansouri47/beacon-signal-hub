import { Badge } from '@/components/ui/badge';

type EmergencyLevel = 'low' | 'medium' | 'high';

interface StatusBadgeProps {
  level: EmergencyLevel;
  className?: string;
}

const levelConfig = {
  low: {
    label: 'Low',
    variant: 'success' as const,
    className: 'bg-success text-white'
  },
  medium: {
    label: 'Medium', 
    variant: 'warning' as const,
    className: 'bg-warning text-black'
  },
  high: {
    label: 'High',
    variant: 'emergency' as const, 
    className: 'bg-danger text-white glow-red'
  }
};

export const StatusBadge = ({ level, className = '' }: StatusBadgeProps) => {
  const config = levelConfig[level];
  
  return (
    <Badge 
      className={`${config.className} font-semibold px-3 py-1 ${className}`}
    >
      {config.label}
    </Badge>
  );
};