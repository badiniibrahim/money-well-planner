"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Menu, Wallet, TrendingUp, Gift, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-1.5 ${color}`}>
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm text-slate-300">{label}</span>
        </div>
        <span
          className={`text-sm font-medium ${color.replace("bg-", "text-")}`}
        >
          {percentage}%
        </span>
      </div>
      <Progress value={percentage} className={`h-1.5 ${color}`} />
    </div>
  );
}

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center gap-3 px-6 border-b border-slate-700/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            BudgetPro
          </h1>
          <p className="text-xs text-slate-400">
            Gérez vos finances intelligemment
          </p>
        </div>
      </div>

      <Card className="mx-4 mt-6 bg-slate-800/50 p-5 border-slate-700/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-300">
            Vue d'ensemble
          </span>
          <span className="text-sm font-semibold text-white">2,450 €</span>
        </div>
        <div className="space-y-4">
          <BudgetCard
            label="Besoins essentiels"
            percentage={50}
            color="bg-emerald-500"
            icon={TrendingUp}
          />
          <BudgetCard
            label="Épargne"
            percentage={30}
            color="bg-blue-500"
            icon={Wallet}
          />
          <BudgetCard
            label="Plaisirs"
            percentage={20}
            color="bg-violet-500"
            icon={Gift}
          />
        </div>
      </Card>

      <ScrollArea className="flex-1 px-3 py-6">
        <nav className="space-y-1">
          {sidebarLinks.map((route, index) => {
            const isActive =
              pathname === route.route ||
              pathname.startsWith(`${route.route}/`);

            return (
              <Link
                key={index}
                href={route.route}
                className={cn(
                  "group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-white"
                    : "text-slate-300 hover:bg-slate-800/50"
                )}
              >
                <route.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-400 group-hover:text-slate-300"
                  )}
                />
                {route.label}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-6 bg-slate-700/50" />

        <div className="px-4 py-2">
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-blue-500/20 p-2">
                <Lightbulb className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="font-medium text-white">Conseil du jour</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pensez à mettre en place une épargne automatique pour atteindre
              vos objectifs plus rapidement.
            </p>
          </Card>
        </div>
      </ScrollArea>

      <div className="mt-auto border-t border-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
            <div className="absolute inset-[2px] rounded-full bg-slate-800" />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
              JD
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Jean Dupont</p>
            <p className="text-xs text-slate-400">Plan Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <>
      {/* Version mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/50"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Version desktop */}
      <div className="relative hidden md:flex h-screen w-80 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/50">
        <SidebarContent />
      </div>
    </>
  );
}

export default Sidebar;
