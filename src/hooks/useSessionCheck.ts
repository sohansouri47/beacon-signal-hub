import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, useDescope } from '@descope/react-sdk';

const useSessionCheck = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
  const sdk = useDescope();

  useEffect(() => {
    if (!isSessionLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (sessionToken) {
        console.log("Session valid")
      }
    }
  }, [isAuthenticated, isSessionLoading, sessionToken, navigate]);
  const logout = async () => {
    await sdk.logout();
    navigate('/login');
  };

  return { logout };
};

export default useSessionCheck;
