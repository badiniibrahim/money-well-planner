import React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { State } from "@/src/entities/models/dashboard/state";

const COLORS = ["#4F46E5", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p>
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(data.value)}
        </p>
      </div>
    );
  }
  return null;
}

function PieStateChart({ state }: { state: State }) {
  const chartData = [
    { name: "Charges Fixes", value: state.totalFixed },
    { name: "Charges Variables", value: state.totalVariable },
    { name: "Épargne & Invest", value: state.savings },
    { name: "Dettes", value: state.totalDebt },
    { name: "Loisirs", value: state.totalPleasure },
  ];

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h2 className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        Répartition du Budget
      </h2>
      <div className="relative w-64 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55} // Donut Chart (trou au centre)
              outerRadius={85}
              paddingAngle={4}
              strokeWidth={2}
              stroke="#ffffff"
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Texte au centre du donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total Budget
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(state.totalBudget)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PieStateChart;
