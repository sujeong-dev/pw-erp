"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  Banknote,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/src/shared/config";

const navItems = [
  { label: "대시보드", href: ROUTES.dashboard.root, icon: LayoutDashboard, exact: true },
  { label: "거래처 관리", href: ROUTES.dashboard.clients, icon: Building2, exact: false },
  { label: "주문 내역", href: ROUTES.dashboard.orders, icon: ShoppingCart, exact: false },
  { label: "입금 내역", href: ROUTES.dashboard.payments, icon: Banknote, exact: false },
  { label: "전체 장부", href: ROUTES.dashboard.ledger, icon: BookOpen, exact: false },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <ul className="flex flex-col gap-1 p-3">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
