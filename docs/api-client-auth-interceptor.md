# API Client 인증 인터셉터 트러블슈팅

## 개요

`ky` 기반 API 클라이언트에서 Access Token 만료 시 자동 갱신 및 재시도 로직을 구현하면서 발생한 문제들과 해결 과정을 정리합니다.

---

## 문제 1: 인터셉터가 동작하지 않음 (console.log가 브라우저에 출력되지 않음)

### 원인

`client.ts`에 `"use client"` 지시어가 없어서 Next.js RSC(React Server Component) 환경에서 실행됨.

- `console.log` → 브라우저 콘솔이 아닌 **터미널(Node.js 서버)**에 출력
- `window` 접근 → `window is not defined` 에러
- Zustand store(`useAuthStore`) → 서버에서는 초기값(null) 반환

### 해결

파일 상단에 `'use client'` 추가 → 클라이언트 전용 모듈로 선언.

---

## 문제 2: 동일 API가 여러 번 호출됨

### 원인 1: `retry.statusCodes`에 401 포함

ky의 `retry` 기본 `statusCodes`에 401이 포함되어 있어, `afterResponse` 훅의 재시도와 ky 내부 retry가 중복 발동.

```
afterResponse → return apiClient(request) → 401 응답 → ky retry 발동 → 반복
```

### 해결 1

`statusCodes`에서 401 명시 제외.

```ts
retry: {
  limit: 2,
  statusCodes: [408, 500, 502, 503, 504], // 401 제외
}
```

### 원인 2: `return apiClient(request)`로 재시도 시 훅 재진입

`afterResponse`에서 `apiClient(request)`를 반환하면 동일 훅이 다시 실행되어 무한 루프 위험.

### 해결 2

훅이 없는 `baseKy`(prefixUrl도 없음)로 재시도.

```ts
const baseKy = ky.create({ retry: 0 }); // 훅 없음, prefixUrl 없음
```

### 원인 3: prefixUrl 이중 조합

`baseKy`에 `prefixUrl`이 설정된 상태에서 `request.url`(full URL)을 전달하면 URL이 중복 조합됨.

```
prefixUrl: "https://api.example.com/"
input:     "https://api.example.com/api/users"
결과:      "https://api.example.com/https://api.example.com/api/users"  ← 잘못된 URL
```

### 해결 3

`baseKy`에서 `prefixUrl` 제거 → `request.url`(full URL) 그대로 사용.

---

## 문제 3: 시간 차이를 두고 동일 API가 반복 호출됨

### 원인

`refreshPromise`가 `.finally()`에서 너무 일찍 `null`로 초기화됨.

```
Request A → 401 → refreshPromise 생성
Request B → 401 → refreshPromise 공유 (대기)
토큰 갱신 완료 → .finally() → refreshPromise = null  ← 여기서 null
A, B 재시도 시작

Request C → (조금 늦게) 401 도착
→ refreshPromise가 null → 불필요한 토큰 갱신 재요청 발생!
```

### 해결

요청 실패 시 `requestToken`(요청에 사용된 토큰)과 store의 현재 `accessToken`을 비교.
store에 이미 새 토큰이 있으면 갱신 없이 바로 재시도.

```ts
const requestToken = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;

if (accessToken && requestToken !== accessToken) {
  // 다른 요청이 이미 갱신 완료 → 바로 재시도
  return baseKy(request.url, {
    method: request.method,
    headers: { ...Object.fromEntries(request.headers.entries()), Authorization: `Bearer ${accessToken}` },
    retry: 0,
  });
}
```

---

## 문제 4: 로그인 페이지로 이동하지 않음

### 원인 1: `throw new Error(...)` 후 redirect

`redirectToLogin()` 호출 후 `throw`를 사용하면:

1. Next.js error boundary가 에러를 캐치
2. 에러 오버레이(개발 환경) 또는 에러 UI가 navigation보다 먼저 렌더링
3. 결과적으로 `/login`으로 이동하지 않는 것처럼 보임

### 해결 1

`throw` 대신 `return response` → navigation이 방해받지 않음.
ky는 401 응답을 받아 HTTPError를 throw하고, React Query는 이를 정상 에러로 처리.

```ts
if (!refreshToken) {
  redirectToLogin();
  return response; // throw 금지
}
```

### 원인 2: 동시 다발 redirect 호출

여러 요청이 동시에 401을 받으면 `redirectToLogin()`이 여러 번 호출될 수 있음.

### 해결 2

`isRedirecting` 플래그로 redirect를 한 번만 실행.

```ts
let isRedirecting = false;

function redirectToLogin() {
  if (isRedirecting) return;
  isRedirecting = true;
  useAuthStore.getState().clear();
  window.location.href = ROUTES.login;
}
```

---

## 문제 5: 두 토큰 모두 없을 때 불필요한 서버 요청

### 원인

토큰이 전혀 없어도 `beforeRequest`가 Authorization 헤더 없이 요청을 전송.
서버에서 401을 받고 나서야 `afterResponse`에서 redirect → **불필요한 네트워크 왕복** 발생.

### 해결

`beforeRequest`에서 두 토큰 모두 없는 경우 즉시 redirect + 요청 차단.
`DOMException('...', 'AbortError')` 사용: ky와 React Query 모두 AbortError를 "의도적 취소"로 인식해 에러 상태로 처리하지 않음.

```ts
if (!accessToken && !refreshToken) {
  redirectToLogin();
  throw new DOMException('No auth tokens', 'AbortError');
}
```

> **참고**: `ky.stop`은 `beforeRetry` 훅 전용 심볼로, `beforeRequest`에서 사용 불가.

---

## 최종 코드 구조

```
beforeRequest
├── isRedirecting 확인 → true면 종료
├── 두 토큰 모두 없음 → redirectToLogin() + AbortError throw
└── accessToken 있음 → Authorization 헤더 설정

afterResponse (401인 경우에만)
├── requestToken !== accessToken (store에 이미 새 토큰) → 갱신 없이 바로 재시도
├── refreshToken 없음 → redirectToLogin() + return response
├── refreshPromise 없음 → 토큰 갱신 시작 (refreshPromise 생성)
│     └── 갱신 실패 → redirectToLogin() + reject
└── 갱신된 토큰으로 baseKy 재시도 (훅 재진입 없음)
```

---

## 핵심 설계 원칙

| 원칙 | 적용 |
|---|---|
| 훅 재진입 방지 | 재시도는 훅 없는 `baseKy` 사용 |
| 토큰 갱신 중복 방지 | `refreshPromise` 싱글톤으로 동시 요청 공유 |
| 지연 요청 중복 갱신 방지 | `requestToken !== accessToken` 비교로 이미 갱신된 경우 스킵 |
| redirect 중복 방지 | `isRedirecting` 플래그 |
| 불필요한 서버 요청 방지 | `beforeRequest`에서 토큰 없으면 즉시 차단 |
