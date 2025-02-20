"use client";

import Sidebar from "@/components/shared/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 pt-16 md:pt-6">{children}</main>
    </div>
  );
}
