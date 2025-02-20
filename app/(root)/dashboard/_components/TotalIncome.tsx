"use client";

import { DollarSign } from "lucide-react";
import React, { useMemo } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import CountUp from "react-countup";
import { Card, CardContent } from "@/components/ui/card";

function TotalIncome({
  currency,
  totalBudget,
}: {
  currency: string;
  totalBudget: number;
}) {
  const formatter = useMemo(
    () => GetFormatterForCurrency(currency ?? "USD"),
    [currency]
  );

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-blue-100 mb-1">
              Total Income
            </p>
            <CountUp
              preserveValue
              redraw={false}
              end={totalBudget || 0}
              decimals={2}
              formattingFn={(value) => formatter.format(value)}
              className="text-3xl font-bold"
            />
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full mt-5 ml-4">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-blue-500 bg-opacity-50 h-2 rounded-full">
            <div
              className="bg-white h-full rounded-full"
              style={{ width: `${(totalBudget / 10000) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalIncome;
