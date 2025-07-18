import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useQuery } from '@apollo/client';
import { GET_AUTH_USER } from '@/graphql/query/user.query';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  const redirectTo = state ? JSON.parse(decodeURIComponent(state))?.redirectTo || '/dashboard' : '/dashboard';
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if the user is authenticated
  const { data, loading, error: queryError } = useQuery(GET_AUTH_USER, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // If there's an error in the URL, handle it first
        if (error) {
          const errorMessage = decodeURIComponent(error);
          console.error('Authentication error from OAuth:', errorMessage);
          setAuthError(errorMessage);
          toast.error(errorMessage, { duration: 5000 });
          navigate('/login', { state: { error: errorMessage } });
          return;
        }

        // If there's a query error
        if (queryError) {
          console.error('GraphQL query error:', queryError);
          setAuthError('Failed to verify authentication status');
          toast.error('Failed to verify authentication status');
          navigate('/login');
          return;
        }

        // If we have user data, redirect to the intended page
        if (data?.authenticatedUser) {
          toast.success('Successfully signed in');
          navigate(redirectTo);
          return;
        }

        // If we're done loading but don't have user data
        if (!loading) {
          throw new Error('Authentication failed: No user data received');
        }
      } catch (err: any) {
        console.error('Authentication error in callback:', err);
        const errorMessage = err.message || 'Authentication failed. Please try again.';
        setAuthError(errorMessage);
        toast.error(errorMessage);
        navigate('/login', { state: { error: errorMessage } });
      }
    };

    handleCallback();
  }, [data, loading, error, queryError, navigate, redirectTo]);

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-6">{authError}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Completing authentication...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we verify your account</p>
      </div>
    </div>
  );
}
