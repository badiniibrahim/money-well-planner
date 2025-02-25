"use client";

import { useQuery } from "@tanstack/react-query";
import {
  NotificationProvider,
  NotificationCenter,
} from "@/components/NotificationCenterWithContext";
import Sidebar from "@/components/shared/Sidebar";
import Loader from "@/components/shared/Loader";
import AlertComponent from "@/components/shared/AlertComponent";
import { getState } from "./dashboard/_actions/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: state,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["state"],
    queryFn: () => getState(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError && error instanceof Error) {
    return (
      <div className="p-6">
        <AlertComponent message={error.message} />
      </div>
    );
  }

  if (!state) return null;

  return (
    <NotificationProvider state={state}>
      <div className="flex min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
        <Sidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-50 flex items-center justify-end border-b border-slate-700/50 bg-slate-900/50 px-6 py-4 backdrop-blur-xl">
            <NotificationCenter />
          </div>
          <div className="px-4 md:px-8 py-6">{children}</div>
        </main>
      </div>
    </NotificationProvider>
  );
}
