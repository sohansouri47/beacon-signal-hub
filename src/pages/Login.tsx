import { useNavigate } from 'react-router-dom';
import { Descope } from '@descope/react-sdk';
import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/card';

export const Login = () => {
  const navigate = useNavigate();

   const handleSuccess = (e: any) => {
    const userInfo = e.detail.user;
    console.log('Descope login successful. User:', userInfo);

    // Save in localStorage
    localStorage.setItem('user', JSON.stringify(userInfo));
    console.log(JSON.stringify(userInfo))

    navigate('/chat');
  };

  const handleError = (error: any) => {
    console.error('Login error:', error);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-4">
          <Logo size="lg" className="mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome to Beacon</h1>
            <p className="text-muted-foreground">Login in to access emergency communication</p>
          </div>
        </div>

        <div className="space-y-4">
          <Descope
            flowId="sign-in"
            onSuccess={handleSuccess}
            onError={handleError}
            theme="dark"
          />
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-primary hover:underline font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};