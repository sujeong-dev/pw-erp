"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from '@/src/shared/config';
import { useRouter } from 'next/navigation';

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "올바른 이메일 형식을 입력해 주세요.";
    }
    if (password.length < 8) {
      next.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: submit login
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-destructive text-xs">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">비밀번호</Label>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground cursor-pointer"
            onClick={() => {
              // TODO: navigate to find password
            }}
          >
            비밀번호 찾기
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="8자 이상 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-destructive text-xs">
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember email */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember-email"
          checked={rememberEmail}
          onCheckedChange={(checked) => setRememberEmail(checked === true)}
          className='cursor-pointer'
        />
        <Label htmlFor="remember-email" className="cursor-pointer font-normal">
          이메일 기억하기
        </Label>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full cursor-pointer" size="lg" onClick={()=>router.push(ROUTES.dashboard.root)}>
        로그인
      </Button>
    </form>
  );
}
