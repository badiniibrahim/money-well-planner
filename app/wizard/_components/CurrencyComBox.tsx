"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies, Currency } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Main Component
export function CurrencyComBox() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = useState<Currency | null>(null);

  // Fetch user settings
  const userSettings = useQuery({
    queryKey: ["userSettings"],
    queryFn: () =>
      fetch("/api/user-settings", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    staleTime: 300000, // Cache data for 5 minutes
  });

  useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  // Mutation to update currency
  const mutation = useMutation({
    mutationFn: async (currency: string) => {
      const res = await fetch("/api/user-settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      if (!res.ok) throw new Error("Failed to update currency");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Currency updated successfully 🎉", {
        id: "update-currency",
      });
      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: () => {
      toast.error("Something went wrong", { id: "update-currency" });
    },
  });

  const handleSelectionOption = useCallback(
    (value: Currency | null) => {
      if (!value) {
        toast.error("Please select a currency");
        return;
      }
      toast.loading("Updating currency...", { id: "update-currency" });
      mutation.mutate(value.value);
    },
    [mutation]
  );

  // Memoized currency options
  const currencyOptions = useMemo(() => Currencies, []);

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isLoading}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between items-center bg-white border-gray-200 hover:bg-gray-50 text-gray-800 shadow-sm"
              disabled={mutation.isPending}
              aria-label="Select currency"
            >
              {selectedOption ? (
                <>
                  <span className="font-medium">{selectedOption.label}</span>
                  <span className="text-gray-500 ml-2">
                    {selectedOption.value}
                  </span>
                </>
              ) : (
                <>Set currency</>
              )}
              {mutation.isPending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0 shadow-lg" align="start">
            <OptionList
              setOpen={setOpen}
              setSelectedOption={handleSelectionOption}
              options={currencyOptions}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isLoading}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between items-center bg-white border-gray-200 hover:bg-gray-50 text-gray-800 shadow-sm"
            disabled={mutation.isPending}
            aria-label="Select currency"
          >
            {selectedOption ? (
              <>
                <span className="font-medium">{selectedOption.label}</span>
                <span className="text-gray-500 ml-2">
                  {selectedOption.value}
                </span>
              </>
            ) : (
              <>Set currency</>
            )}
            {mutation.isPending && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-t rounded-t-xl shadow-lg">
          <div className="mt-4 p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Select Currency
            </h2>
            <OptionList
              setOpen={setOpen}
              setSelectedOption={handleSelectionOption}
              options={currencyOptions}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

// Option List Component
function OptionList({
  setOpen,
  setSelectedOption,
  options,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
  options: Currency[];
}) {
  return (
    <Command className="rounded-lg">
      <CommandInput
        placeholder="Filter currency..."
        className="focus:ring-0 focus:border-gray-300"
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  options.find((option) => option.value === value) || null
                );
                setOpen(false);
              }}
              className="cursor-pointer hover:bg-gray-50"
              aria-label={`Select ${currency.label}`}
            >
              <span className="font-medium">{currency.label}</span>
              <span className="text-gray-500 ml-2">{currency.value}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
