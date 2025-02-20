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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

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
          <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-6 w-6" />
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            <div className="mb-4">
              {`This action cannot be undone. This will permanently delete your
              ${entityType} and remove your data from our servers.`}
            </div>
            <div className="flex flex-col gap-2">
              <span>
                To confirm, please type{" "}
                <b className="text-white">{entityName}</b>:
              </span>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                placeholder={`Type ${entityName} here`}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            onClick={() => setConfirmText("")}
            className="bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 flex items-center gap-2"
            disabled={confirmText !== entityName || deleteMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              toast.loading(`Deleting ${entityType}...`, { id: entityId });
              deleteMutation.mutate(entityId);
            }}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
