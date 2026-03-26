'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from './authStore';
import { ROUTES } from '@/src/shared/config';

export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);

  return function logout() {
    clear();
    router.push(ROUTES.login);
  };
}
