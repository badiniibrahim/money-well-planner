"use client";

import { HeartHandshake } from "lucide-react";
import React from "react";
import { Pleasure } from "@prisma/client";
import { PleasuresTable } from "./PleasuresTable";
import AlertComponent from "@/components/shared/AlertComponent";
import { Card } from "@/components/ui/card";

type Props = {
  pleasure: Pleasure[];
  currency: string;
};

function UserPleasures({ pleasure, currency }: Props) {
  if (!pleasure) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <div className="p-6">
          <AlertComponent message="Something went wrong. Please try again later." />
        </div>
      </Card>
    );
  }

  if (pleasure.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-slate-800/50 w-24 h-24 flex items-center justify-center mb-6 border border-slate-700/50">
            <HeartHandshake className="h-12 w-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Pleasure Budgets Yet
          </h3>
          <p className="text-slate-400 max-w-sm">
            Start planning for your enjoyment by creating your first pleasure
            budget. Click the "Add New Budget" button above to begin allocating
            funds for your leisure activities.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PleasuresTable pleasure={pleasure} currency={currency} />
    </div>
  );
}

export default UserPleasures;
