import ky from 'ky';
import { useAuthStore } from '@/src/features/auth/model/authStore';
import { ROUTES } from '../config';

type TokenResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// prefixUrl 없이 생성 — token refresh 전용, full URL로 직접 호출
const baseKy = ky.create({ retry: 0 });

let refreshPromise: Promise<string> | null = null;
let isRedirecting = false;

function redirectToLogin() {
  if (isRedirecting) return;
  isRedirecting = true;
  useAuthStore.getState().clear();
  window.location.href = ROUTES.login;
}

export const apiClient = ky.create({
  prefixUrl: baseUrl,
  retry: {
    limit: 2,
    statusCodes: [408, 500, 502, 503, 504], // 401 제외 — afterResponse 훅에서 직접 처리
  },
  hooks: {
    beforeRequest: [
      (request) => {
        if (isRedirecting) return;
        const { accessToken, refreshToken } = useAuthStore.getState();
        if (!accessToken && !refreshToken) {
          // 두 토큰 모두 없으면 서버 요청 없이 즉시 redirect
          redirectToLogin();
          throw new DOMException('No auth tokens', 'AbortError');
        }
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status !== 401) return;

        const { refreshToken, accessToken } = useAuthStore.getState();
        const requestToken = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;

        // store의 토큰이 이미 갱신된 경우 (다른 요청이 먼저 refresh 완료)
        // 불필요한 refresh 없이 바로 새 토큰으로 재시도
        if (accessToken && requestToken !== accessToken) {
          return baseKy(request.url, {
            method: request.method,
            headers: {
              ...Object.fromEntries(request.headers.entries()),
              Authorization: `Bearer ${accessToken}`,
            },
            retry: 0,
          });
        }

        if (!refreshToken) {
          redirectToLogin();
          return response;
        }

        if (!refreshPromise) {
          refreshPromise = baseKy
            .post(`${baseUrl}/api/auth/refresh`, { json: { refreshToken }, retry: 0 })
            .json<TokenResponse>()
            .then((data) => {
              useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
              return data.accessToken;
            })
            .catch(() => {
              redirectToLogin();
              return Promise.reject(new Error('Session expired'));
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        return baseKy(request.url, {
          method: request.method,
          headers: {
            ...Object.fromEntries(request.headers.entries()),
            Authorization: `Bearer ${newToken}`,
          },
          retry: 0,
        });
      },
    ],
  },
});
