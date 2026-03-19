"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogin, useAuthStore } from "@/src/features/auth/model";

const schema = z.object({
  email: z.email("올바른 이메일 형식을 입력해 주세요."),
  password: z.string(),
  rememberEmail: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const setRememberedEmail = useAuthStore((s) => s.setRememberedEmail);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', rememberEmail: false },
  });

  useEffect(() => {
    const saved = useAuthStore.getState().rememberedEmail;
    if (saved) {
      setValue("email", saved);
      setValue("rememberEmail", true);
    }
  }, [setValue]);

  const rememberEmail = useWatch({ control, name: "rememberEmail" });

  function onSubmit(values: FormValues) {
    login(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          setRememberedEmail(values.rememberEmail ? values.email : null);
        },
        onError: () => {
          setError("root", { message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-destructive text-xs">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">비밀번호</Label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="8자 이상 입력해 주세요"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-destructive text-xs">
            {errors.password.message}
          </p>
        )}
        {errors.root && (
          <p className="text-destructive text-xs">{errors.root.message}</p>
        )}
      </div>

      {/* Remember email */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember-email"
          checked={rememberEmail}
          onCheckedChange={(checked) => setValue("rememberEmail", checked === true)}
          className="cursor-pointer"
        />
        <Label htmlFor="remember-email" className="cursor-pointer font-normal">
          이메일 기억하기
        </Label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full cursor-pointer"
        size="lg"
        disabled={isPending}
      >
        {isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
