import { DashboardNav } from "@/src/widgets/dashboard-nav/ui";
import { DashboardGnb } from "@/src/widgets/dashboard-gnb/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardGnb />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 overflow-auto max-w-300">{children}</main>
      </div>
    </div>
  );
}
