import { useState } from 'react';
import { Button } from './ui/button';
import { FaGoogle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface GoogleOAuthButtonProps {
  text?: string;
  className?: string;
}

const GoogleOAuthButton = ({
  text = 'Continue with Google',
  className = '',
}: GoogleOAuthButtonProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Generate a unique nonce for CSRF protection
      const nonce = Math.random().toString(36).substring(2, 15);
      
      // Prepare the state object with redirect info and nonce
      const state = {
        redirectTo: location.pathname + location.search,
        nonce,
        timestamp: Date.now()
      };
      
      // Encode the redirect URI and state
      const redirectUri = `${window.location.origin}/auth/callback`;
      const encodedState = encodeURIComponent(JSON.stringify(state));
      
      // Build the OAuth URL
      const authUrl = new URL(
        '/auth/google',
        import.meta.env.VITE_API_URL || 'http://localhost:4001'
      );


      // Add required parameters
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', encodedState);
      
      // Store the nonce in session storage for verification
      sessionStorage.setItem('oauth_nonce', nonce);
      
      // Redirect to the backend's Google OAuth endpoint
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error initiating Google OAuth:', error);
      toast.error('Failed to start Google sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 ${className}`}
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <FaGoogle className="text-red-500" />
          <span>{text}</span>
        </>
      )}
    </Button>
  );
};

export default GoogleOAuthButton;
