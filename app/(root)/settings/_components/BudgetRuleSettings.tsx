"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateBudgetRules } from "../_actions/actions";
import {
  PieChart,
  Loader2,
  Save,
  AlertTriangle,
  Info,
  Check,
  Lightbulb,
  Percent,
  DollarSign,
  ShoppingBag,
  Home,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetRuleProps {
  budgetRules?: {
    id: number;
    needsPercentage: number;
    savingsPercentage: number;
    wantsPercentage: number;
    actualNeedsPercentage: number;
    actualSavingsPercentage: number;
    actualWantsPercentage: number;
    clerkId: string;
  } | null;
}

function BudgetRuleSettings({ budgetRules }: BudgetRuleProps) {
  const [needs, setNeeds] = useState(budgetRules?.needsPercentage || 50);
  const [savings, setSavings] = useState(budgetRules?.savingsPercentage || 30);
  const [wants, setWants] = useState(budgetRules?.wantsPercentage || 20);
  const [total, setTotal] = useState(100);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateBudgetRules,
    onSuccess: () => {
      toast.success("Budget rules updated successfully", {
        description: "Your budget allocation has been saved.",
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["getUserSettings"] });
      queryClient.invalidateQueries({ queryKey: ["getAllIncome"] });
    },
    onError: () => {
      toast.error("Failed to update budget rules");
    },
  });

  // Calculate total whenever any value changes
  useEffect(() => {
    const newTotal = needs + savings + wants;
    setTotal(newTotal);

    if (newTotal !== 100) {
      setError("Total must equal 100%");
    } else {
      setError("");
    }
  }, [needs, savings, wants]);

  const handleNeedsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setNeeds(value);
  };

  const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setSavings(value);
  };

  const handleWantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setWants(value);
  };

  // Auto-adjust to maintain 100% total
  const handleAutoAdjust = () => {
    if (total !== 100) {
      // Determine which value to adjust based on which was changed last
      const remaining = 100 - needs - savings;
      if (remaining >= 0) {
        setWants(remaining);
      } else {
        // If negative remaining, adjust savings
        const newSavings = 100 - needs - wants;
        if (newSavings >= 0) {
          setSavings(newSavings);
        } else {
          // Last resort, adjust needs
          setNeeds(100 - savings - wants);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (total !== 100) {
      toast.error("Total must equal 100% before saving");
      return;
    }

    updateMutation.mutate({
      needsPercentage: needs,
      savingsPercentage: savings,
      wantsPercentage: wants,
    });
  };

  const getColor = (value: number, target: number) => {
    if (value > target + 5) return "text-slate-300";
    if (value < target - 5) return "text-slate-300";
    return "text-slate-300";
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "50-30-20":
        setNeeds(50);
        setSavings(30);
        setWants(20);
        break;
      case "60-20-20":
        setNeeds(60);
        setSavings(20);
        setWants(20);
        break;
      case "40-40-20":
        setNeeds(40);
        setSavings(40);
        setWants(20);
        break;
      case "70-20-10":
        setNeeds(70);
        setSavings(20);
        setWants(10);
        break;
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-700/10 pointer-events-none"></div>
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
            <PieChart className="h-5 w-5 text-slate-300" />
          </div>
          Budget Rule Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-br from-slate-800/40 to-slate-700/20 rounded-xl border border-slate-700/30 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-white mb-1">
                    Budget Rule Explained
                  </h3>
                  <p className="text-sm text-slate-300">
                    The budget rule helps you allocate your income into three
                    categories: Needs, Savings, and Wants. The standard 50-30-20
                    rule suggests allocating 50% to needs, 30% to savings, and
                    20% to wants.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("50-30-20")}
                  className="text-xs bg-slate-800/40 border-slate-700/30 text-white hover:bg-slate-700/50 hover:border-slate-600/50"
                >
                  50-30-20
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("60-20-20")}
                  className="text-xs bg-slate-800/40 border-slate-700/30 text-white hover:bg-slate-700/50 hover:border-slate-600/50"
                >
                  60-20-20
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("40-40-20")}
                  className="text-xs bg-slate-800/40 border-slate-700/30 text-white hover:bg-slate-700/50 hover:border-slate-600/50"
                >
                  40-40-20
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("70-20-10")}
                  className="text-xs bg-slate-800/40 border-slate-700/30 text-white hover:bg-slate-700/50 hover:border-slate-600/50"
                >
                  70-20-10
                </Button>
              </div>
            </div>

            {budgetRules && (
              <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-6">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-slate-300" />
                  Current Allocation
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-800/70 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="h-4 w-4 text-slate-300" />
                      <p className="text-xs font-medium text-slate-300">
                        Needs
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold ${getColor(
                        budgetRules.actualNeedsPercentage,
                        needs
                      )}`}
                    >
                      {budgetRules.actualNeedsPercentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Target: {needs}%
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/70 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="h-4 w-4 text-slate-300" />
                      <p className="text-xs font-medium text-slate-300">
                        Savings
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold ${getColor(
                        budgetRules.actualSavingsPercentage,
                        savings
                      )}`}
                    >
                      {budgetRules.actualSavingsPercentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Target: {savings}%
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/70 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="h-4 w-4 text-slate-300" />
                      <p className="text-xs font-medium text-slate-300">
                        Wants
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold ${getColor(
                        budgetRules.actualWantsPercentage,
                        wants
                      )}`}
                    >
                      {budgetRules.actualWantsPercentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Target: {wants}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <Home className="h-4 w-4 text-slate-300" />
                    Needs
                  </Label>
                  <span className="text-xs text-slate-300 bg-slate-700/40 px-2 py-0.5 rounded-full">
                    Essential expenses
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={needs}
                    onChange={handleNeedsChange}
                    className="pr-8 bg-slate-800/70 border-slate-700/50 text-white focus:border-slate-500 focus:ring-slate-500 text-lg font-bold"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                    %
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Rent, utilities, groceries, etc.
                </p>
              </div>

              <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-slate-300" />
                    Savings
                  </Label>
                  <span className="text-xs text-slate-300 bg-slate-700/40 px-2 py-0.5 rounded-full">
                    Future security
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={savings}
                    onChange={handleSavingsChange}
                    className="pr-8 bg-slate-800/70 border-slate-700/50 text-white focus:border-slate-500 focus:ring-slate-500 text-lg font-bold"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                    %
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Investments, emergency fund, debt repayment
                </p>
              </div>

              <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-slate-300" />
                    Wants
                  </Label>
                  <span className="text-xs text-slate-300 bg-slate-700/40 px-2 py-0.5 rounded-full">
                    Lifestyle choices
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={wants}
                    onChange={handleWantsChange}
                    className="pr-8 bg-slate-800/70 border-slate-700/50 text-white focus:border-slate-500 focus:ring-slate-500 text-lg font-bold"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                    %
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Entertainment, dining out, hobbies
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800/70 flex items-center justify-center border border-slate-700/50">
                  <span
                    className={`text-lg font-bold ${
                      total === 100 ? "text-slate-300" : "text-slate-300"
                    }`}
                  >
                    {total}%
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Total Allocation
                  </h3>
                  <p className="text-xs text-slate-400">Must equal 100%</p>
                </div>
              </div>

              {total !== 100 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAutoAdjust}
                  className="bg-slate-800/40 border-slate-700/30 text-white hover:bg-slate-700/50 hover:border-slate-600/50"
                >
                  Auto-balance to 100%
                </Button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300">
                <AlertTriangle className="h-5 w-5 text-slate-300 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-slate-700/20 transform hover:translate-y-[-2px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-slate-700/50"
            disabled={updateMutation.isPending || total !== 100}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Budget Rules
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default BudgetRuleSettings;
