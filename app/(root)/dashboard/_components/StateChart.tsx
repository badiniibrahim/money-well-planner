import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { State } from "@/src/entities/models/dashboard/state";

const COLORS = {
  totalIncome: "#4F46E5",
  fixedCharges: "#F59E0B",
  variableCharges: "#10B981",
  savings: "#3B82F6",
  debts: "#EF4444",
  pleasure: "#8B5CF6",
};

function StateChart({ state }: { state: State }) {
  const chartData = [
    {
      name: "Total Income",
      value: state.totalBudget,
      fill: COLORS.totalIncome,
    },
    {
      name: "Fixed Charges",
      value: state.totalFixed,
      fill: COLORS.fixedCharges,
    },
    {
      name: "Variable Charges",
      value: state.totalVariable,
      fill: COLORS.variableCharges,
    },
    { name: "Savings & Investing", value: state.savings, fill: COLORS.savings },
    { name: "Debts", value: state.totalDebt, fill: COLORS.debts },
    { name: "Pleasure", value: state.totalPleasure, fill: COLORS.pleasure },
  ];

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Répartition du Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={40}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => formatter.format(value).split(",")[0]}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value) => [
                  formatter.format(Number(value)),
                  "Montant",
                ]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value: any) =>
                    formatter.format(Number(value)).split(",")[0]
                  }
                  style={{ fill: "#6B7280", fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default StateChart;
