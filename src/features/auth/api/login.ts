import { apiClient } from '@/src/shared/api';

export type LoginRequest = { email: string; password: string };
export type LoginResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export async function login(body: LoginRequest): Promise<LoginResponse> {
  return apiClient.post('api/auth/login', { json: body }).json<LoginResponse>();
}
