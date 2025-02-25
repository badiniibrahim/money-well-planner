"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  textClassName?: string;
}

const Loader = ({
  size = "md",
  text = "Loading...",
  className,
  textClassName,
}: LoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2
        className={cn(
          "animate-spin text-slate-400",
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className={cn("text-slate-400 text-sm font-medium", textClassName)}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
