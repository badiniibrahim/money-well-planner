"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

function AlertComponent({ message }: { message: string }) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <div className="p-6">
        <Alert
          variant="destructive"
          className="bg-rose-500/10 border-rose-500/20"
        >
          <AlertCircle className="h-5 w-5 text-rose-400" />
          <AlertTitle className="text-rose-400 font-semibold mb-1">
            Error
          </AlertTitle>
          <AlertDescription className="text-slate-300">
            {message}
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
}

export default AlertComponent;
