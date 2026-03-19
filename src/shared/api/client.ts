import ky from 'ky';
import { useAuthStore } from '@/src/features/auth/model/authStore';
import { ROUTES } from '../config';

type TokenResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

// Plain ky instance with no interceptors — used only for token refresh to avoid infinite loop
const baseKy = ky.create({ prefixUrl: baseUrl });

let refreshPromise: Promise<string> | null = null;

export const apiClient = ky.create({
  prefixUrl: baseUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status !== 401) return;

        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
          useAuthStore.getState().clear();
          window.location.href = '/login';
          return;
        }

        if (!refreshPromise) {
          refreshPromise = baseKy
            .post('api/auth/refresh', { json: { refreshToken } })
            .json<TokenResponse>()
            .then((data) => {
              useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
              return data.accessToken;
            })
            .catch(() => {
              useAuthStore.getState().clear();
              window.location.href = ROUTES.login;
              throw new Error('Session expired');
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;
        request.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient(request);
      },
    ],
  },
});
