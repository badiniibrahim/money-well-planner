"use client";

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
import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Loader2, XCircle } from "lucide-react";

type Props = {
  open: boolean;
  entityType: string;
  setOpen: (value: boolean) => void;
  entityName: string;
  entityId: number;
  deleteMutation: UseMutationResult<any, unknown, number>;
};

export function DeleteAlertDialog({
  open,
  entityType,
  setOpen,
  entityName,
  entityId,
  deleteMutation,
}: Props) {
  const [confirmText, setConfirmText] = useState<string>("");

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 text-white">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              Confirm Deletion
            </AlertDialogTitle>
            <XCircle
              className="h-6 w-6 text-slate-400 hover:text-slate-300 cursor-pointer transition-colors"
              onClick={() => {
                setOpen(false);
                setConfirmText("");
              }}
            />
          </div>
          <AlertDialogDescription className="mt-4 space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <p className="text-slate-300">
                This action cannot be undone. This will permanently delete your{" "}
                <span className="text-rose-400 font-medium">{entityType}</span>{" "}
                and remove your data from our servers.
              </p>
            </div>
            <div className="space-y-3">
              <label className="text-slate-300 block">
                To confirm, please type{" "}
                <span className="font-semibold text-white">{entityName}</span>:
              </label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-rose-500/50 focus:ring-rose-500/20"
                placeholder={entityName}
                autoComplete="off"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-2">
          <AlertDialogCancel
            onClick={() => setConfirmText("")}
            className="bg-transparent border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-white focus:ring-slate-700/50 transition-colors"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200
              ${
                confirmText !== entityName || deleteMutation.isPending
                  ? "bg-rose-500/50 text-rose-200 cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }
              focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
            `}
            disabled={confirmText !== entityName || deleteMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              toast.loading(`Deleting ${entityType}...`, { id: entityId });
              deleteMutation.mutate(entityId);
            }}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete {entityType}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
