import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { LoginForm } from "@/src/features/auth/ui/LoginForm";
import Image from 'next/image';

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex items-center justify-center text-center">
           <Image src="/CI.png" alt="CI" width={40} height={40} priority />
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
