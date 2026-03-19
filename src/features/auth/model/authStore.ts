import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  rememberedEmail: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setRememberedEmail: (email: string | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      rememberedEmail: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setRememberedEmail: (email) => set({ rememberedEmail: email }),
      clear: () => set({ accessToken: null, refreshToken: null }),
    }),
    { name: 'auth' },
  ),
);
