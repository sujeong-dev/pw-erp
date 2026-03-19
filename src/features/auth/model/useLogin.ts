import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login } from '@/src/features/auth/api';
import { useAuthStore } from './authStore';
import { ROUTES } from '@/src/shared/config';

export function useLogin() {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      router.push(ROUTES.dashboard.root);
    },
  });
}
