import { useNavigate } from 'react-router-dom';
import { Descope } from '@descope/react-sdk';
import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/card';

export const Signup = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/chat');
  };

  const handleError = (error: any) => {
    console.error('Signup error:', error);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-4">
          <Logo size="lg" className="mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Join Beacon</h1>
            <p className="text-muted-foreground">Create your emergency communication account</p>
          </div>
        </div>

        <div className="space-y-4">
          <Descope
            flowId="sign-up"
            onSuccess={handleSuccess}
            onError={handleError}
            theme="dark"
          />
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};