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
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { DeleteAlertDialog } from "@/components/shared/DeleteAlertDialog";
import { UseMutationResult } from "@tanstack/react-query";

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
          <Button variant="outline" size={"sm"}>
            <div
              className="flex items-center justify-center 
            w-full h-full"
            >
              <MoreVerticalIcon size={18} />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDialog((prev) => !prev)}
            className="text-destructive flex items-center gap-2"
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default DialogAction;
