import ky from 'ky';

export type LoginRequest = { email: string; password: string };
export type LoginResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export async function login(body: LoginRequest): Promise<LoginResponse> {
  return ky.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { json: body }).json<LoginResponse>();
}
