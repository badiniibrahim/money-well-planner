"use client";

import React, { useMemo } from "react";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import {
  Menu,
  Wallet,
  TrendingUp,
  Gift,
  Lightbulb,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDashboardStore } from "@/store/dashboardStore";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { UserButton } from "@clerk/nextjs";

function BudgetCard({
  label,
  percentage,
  color,
  icon: Icon,
}: {
  label: string;
  percentage: number;
  color: string;
  icon: any;
}) {
  return (
    <div className="group">
      <div
        className={cn(
          "rounded-lg border p-2",
          "bg-slate-800/50 border-slate-700/50",
          "hover:bg-slate-700/50 transition-colors duration-200"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className={cn(
              "rounded-md p-1.5 transition-transform duration-200 group-hover:scale-110",
              color.replace("bg-", "bg-opacity-20 ")
            )}
          >
            <Icon
              className={cn("h-3.5 w-3.5", color.replace("bg-", "text-"))}
            />
          </div>
          <div className="flex items-center justify-between flex-1">
            <span className="text-xs font-medium text-slate-200">{label}</span>
            <span
              className={cn(
                "text-xs font-semibold",
                color.replace("bg-", "text-")
              )}
            >
              {percentage}%
            </span>
          </div>
        </div>

        <Progress
          value={percentage}
          className={cn(
            "h-1 rounded-full",
            color.replace("bg-", "bg-opacity-20 "),
            `[&>div]:${color}`
          )}
        />
      </div>
    </div>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const { state } = useDashboardStore();
  const formatter = GetFormatterForCurrency(state?.currency ?? "USD");

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/5 backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105">
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            BudgetPro
          </h1>
          <p className="text-xs font-medium text-slate-400">
            Manage your finances intelligently
          </p>
        </div>
      </div>

      <Card className="mx-4 mt-4 bg-gradient-to-br from-slate-800/50 to-slate-800/30 p-3 border-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-300">Overview</span>
          <span className="text-xs font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {formatter.format(state.totalBudget)}
          </span>
        </div>
        <div className="space-y-2">
          <BudgetCard
            label="Essential Needs"
            percentage={50}
            color="bg-emerald-500"
            icon={TrendingUp}
          />
          <BudgetCard
            label="Savings"
            percentage={30}
            color="bg-blue-500"
            icon={Wallet}
          />
          <BudgetCard
            label="Discretionary"
            percentage={20}
            color="bg-violet-500"
            icon={Gift}
          />
        </div>
      </Card>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2.5">
          {sidebarLinks.map((route, index) => {
            const isActive =
              pathname === route.route ||
              pathname.startsWith(`${route.route}/`);

            return (
              <Link
                key={index}
                href={route.route}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <route.icon
                  className={cn(
                    "mr-3 h-4.5 w-4.5 transition-all duration-200",
                    isActive
                      ? "text-blue-400 scale-110"
                      : "text-slate-400 group-hover:text-slate-200 group-hover:scale-110"
                  )}
                />
                {route.label}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-5 bg-white/5" />

        <div className="px-3">
          <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent border-blue-500/20 p-3.5 rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="rounded-lg bg-blue-500/20 p-2 backdrop-blur-xl">
                <Lightbulb className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <h3 className="font-medium text-sm text-white">Tip of the Day</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consider setting up automatic savings to reach your financial
              goals faster.
            </p>
          </Card>
        </div>
      </ScrollArea>

      <div className="mt-auto border-t border-white/5 p-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: 32,
                height: 32,
              },
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="Billing"
              labelIcon={<CreditCard className="size-4" />}
              href="/billing"
            />
          </UserButton.MenuItems>
        </UserButton>
      </div>
    </div>
  );
}

function Sidebar() {
  const memoizedSidebarContent = useMemo(() => <SidebarContent />, []);

  return (
    <>
      {/* Mobile version */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0 bg-gradient-to-b from-[#0A0F1C] via-[#0A0F1C] to-[#0A0F1C]/90 border-r border-white/5"
        >
          {memoizedSidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop version */}
      <div className="relative hidden md:flex h-screen w-80 flex-col bg-gradient-to-b from-[#0A0F1C] via-[#0A0F1C] to-[#0A0F1C]/90 border-r border-white/5">
        {memoizedSidebarContent}
      </div>
    </>
  );
}

export default Sidebar;
