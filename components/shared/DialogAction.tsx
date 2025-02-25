"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { DeleteAlertDialog } from "@/components/shared/DeleteAlertDialog";
import { UseMutationResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type Props = {
  entityName: string;
  entityId: number;
  entityType: string;
  deleteMutation: UseMutationResult<any, unknown, number>;
};

function DialogAction({
  entityName,
  entityId,
  entityType,
  deleteMutation,
}: Props) {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  return (
    <>
      <DeleteAlertDialog
        entityId={entityId}
        entityType={entityType}
        entityName={entityName}
        open={showDialog}
        setOpen={setShowDialog}
        deleteMutation={deleteMutation}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 p-0 text-slate-400",
              "hover:bg-slate-800/50 hover:text-slate-300",
              "focus:ring-slate-700/50 focus:ring-offset-slate-900",
              "data-[state=open]:bg-slate-800/50 data-[state=open]:text-slate-300"
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-slate-800 border-slate-700/50"
        >
          <DropdownMenuLabel className="text-slate-300">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-700/50" />
          <DropdownMenuItem
            onSelect={() => setShowDialog(true)}
            className={cn(
              "flex items-center gap-2 text-rose-400 cursor-pointer",
              "hover:text-rose-300 hover:bg-slate-700/50",
              "focus:bg-slate-700/50"
            )}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default DialogAction;
