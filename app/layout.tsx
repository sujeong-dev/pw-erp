import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/src/shared/lib/providers/QueryProvider";
import { MSWProvider } from "@/src/shared/lib/providers/MSWProvider";


export const metadata: Metadata = {
  title: "피원 어드민 페이지",
  description: "피원 어드민 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <MSWProvider>
          <QueryProvider>{children}</QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
