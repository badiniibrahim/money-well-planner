"use client";

import React from "react";
import CountUp from "react-countup";
import { Card, CardContent } from "@/components/ui/card";

type ExpenseCardProps = {
  title: string;
  value: number;
  color: string;
  icon: React.ElementType;
  currencyFormatter: (value: number) => string;
};

function ExpenseCard({
  title,
  value,
  color,
  icon: Icon,
  currencyFormatter,
}: ExpenseCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${color}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-full bg-white/20`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
            <CountUp
              preserveValue
              redraw={false}
              end={value || 0}
              decimals={2}
              formattingFn={currencyFormatter}
              className="text-2xl font-bold text-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExpenseCard;
