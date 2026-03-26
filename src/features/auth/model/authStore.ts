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
      setTokens: (accessToken, refreshToken) => {
        if (typeof document !== 'undefined') {
          document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
        set({ accessToken, refreshToken });
      },
      setRememberedEmail: (email) => set({ rememberedEmail: email }),
      clear: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'access_token=; path=/; max-age=0';
        }
        set({ accessToken: null, refreshToken: null });
      },
    }),
    { name: 'auth' },
  ),
);
