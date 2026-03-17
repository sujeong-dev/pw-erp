"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/src/shared/config";

export function DashboardGnb() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
      <Image src="/CI.png" alt="CI" width={40} height={40} priority />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="size-5" />
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.login}>
            <LogOut className="size-4" />
            로그아웃
          </Link>
        </Button>
      </div>
    </header>
  );
}
