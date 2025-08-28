import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <Logo size="xl" className="glow-amber" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Beacon</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Your signal in any crisis.
          </p>
        </div>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};