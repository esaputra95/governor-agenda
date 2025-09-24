import type { ReactNode } from "react";
import MainLayout from "@/components/layouts/MainLayout";
export const metadata = { title: "App" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        <MainLayout>{children}</MainLayout>
        {/* </Providers> */}
      </body>
    </html>
  );
}
