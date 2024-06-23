import { useParams } from 'react-router-dom';

import { useAuth } from '@/auth/hooks/useAuth';

export const useSignInWithOpenIdConnect = () => {
  const workspaceInviteHash = useParams().workspaceInviteHash;
  const { signInWithOpenIdConnect } = useAuth();
  return {
    signInWithOpenIdConnect: () => signInWithOpenIdConnect(workspaceInviteHash),
  };
};
