"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteGoal, updateGoalProgress } from "../_actions/actions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Target,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Trash2,
  Edit,
  Clock,
  AlertTriangle,
  Flag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface Milestone {
  id: number;
  goalId: number;
  name: string;
  targetAmount: number;
  targetDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  achievedAmount: number;
}

interface FinancialGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  targetDate: Date;
  status: string;
  priority: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  milestones: Milestone[];
}

interface Props {
  goals: FinancialGoal[];
}

function GoalCard({ goal }: { goal: FinancialGoal }) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showProgressDialog, setShowProgressDialog] = React.useState(false);
  const [progressAmount, setProgressAmount] = React.useState(
    goal.currentAmount.toString()
  );
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      toast.success("Goal deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllGoals"] });
    },
    onError: () => {
      toast.error("Failed to delete goal");
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({
      goalId,
      currentAmount,
    }: {
      goalId: number;
      currentAmount: number;
    }) => updateGoalProgress(goalId, currentAmount),
    onSuccess: () => {
      toast.success("Progress updated successfully");
      setShowProgressDialog(false);
      queryClient.invalidateQueries({ queryKey: ["getAllGoals"] });
    },
    onError: () => {
      toast.error("Failed to update progress");
    },
  });

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24)
  );
  const isOverdue = daysLeft < 0;

  const priorityColors = {
    low: "text-emerald-400 bg-emerald-400/10",
    medium: "text-blue-400 bg-blue-400/10",
    high: "text-rose-400 bg-rose-400/10",
  };

  const statusColors = {
    in_progress: "text-blue-400 bg-blue-400/10",
    completed: "text-emerald-400 bg-emerald-400/10",
    cancelled: "text-slate-400 bg-slate-400/10",
  };

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden",
          "bg-gradient-to-b from-slate-900/50 via-slate-900/50 to-slate-800/50",
          "border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/10" />
        <div className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">{goal.name}</h3>
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-0.5 rounded-full",
                    priorityColors[goal.priority as keyof typeof priorityColors]
                  )}
                >
                  {goal.priority.charAt(0).toUpperCase() +
                    goal.priority.slice(1)}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-0.5 rounded-full",
                    statusColors[goal.status as keyof typeof statusColors]
                  )}
                >
                  {goal.status
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </div>
              {goal.description && (
                <p className="text-sm text-slate-400 mb-4">
                  {goal.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-slate-300">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={() => setShowProgressDialog(true)}
                  className="text-slate-200 focus:text-slate-200 focus:bg-slate-700"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Update Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-rose-400 focus:text-rose-400 focus:bg-slate-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span>Progress</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-white">
                    {goal.currentAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-slate-400">
                    {" / "}
                    {goal.targetAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              <Progress
                value={progress}
                className="h-2 bg-slate-700/50 [&>div]:bg-blue-500"
              />
            </div>

            {goal.milestones.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Flag className="h-4 w-4 text-slate-400" />
                  <span>Milestones</span>
                </div>
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between text-sm bg-slate-800/50 rounded-lg p-2"
                    >
                      <span className="text-slate-300">{milestone.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {(
                            (milestone.achievedAmount /
                              milestone.targetAmount) *
                            100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">
                  {format(new Date(goal.targetDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isOverdue ? (
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                ) : (
                  <Clock className="h-4 w-4 text-slate-400" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    isOverdue ? "text-rose-400" : "text-slate-300"
                  )}
                >
                  {isOverdue
                    ? `${Math.abs(daysLeft)} days overdue`
                    : `${daysLeft} days left`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Goal
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this goal? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate(goal.id);
                setShowDeleteDialog(false);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Progress Dialog */}
      <AlertDialog
        open={showProgressDialog}
        onOpenChange={setShowProgressDialog}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Update Progress
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Enter the current amount saved towards this goal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="number"
                value={progressAmount}
                onChange={(e) => setProgressAmount(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                updateProgressMutation.mutate({
                  goalId: goal.id,
                  currentAmount: parseFloat(progressAmount),
                });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function FinancialGoalsList({ goals }: Props) {
  const sortedGoals = React.useMemo(() => {
    return [...goals].sort((a, b) => {
      // Trier par priorité (high > medium > low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff =
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder];
      if (priorityDiff !== 0) return priorityDiff;

      // Puis par date cible (plus proche en premier)
      return (
        new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
      );
    });
  }, [goals]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedGoals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

export default FinancialGoalsList;
