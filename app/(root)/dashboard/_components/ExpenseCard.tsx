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
    <Card className={`bg-slate-800 border-slate-700 overflow-hidden`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div
          className={`${color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="mt-auto">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <CountUp
            preserveValue
            redraw={false}
            end={value || 0}
            decimals={2}
            formattingFn={currencyFormatter}
            className="text-2xl font-bold text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ExpenseCard;