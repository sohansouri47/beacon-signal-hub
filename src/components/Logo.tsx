import logoImage from '@/assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
};

export const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  return (
    <img 
      src={logoImage} 
      alt="Beacon Logo" 
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
};