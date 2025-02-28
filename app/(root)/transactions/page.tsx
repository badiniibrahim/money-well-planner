"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllTransactions } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import TransactionsList from "./_components/TransactionsList";

function TransactionsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllTransactions"],
    queryFn: () => getAllTransactions(),
  });

  if (isError && error instanceof Error) {
    return (
      <div className="p-6">
        <AlertComponent message={error.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Transactions</h1>
            <p className="text-slate-400">Track all your financial movements</p>
          </div>
          <CreateTransactionDialog
            trigger={
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-emerald-500/20 transform hover:scale-105 transition-all duration-300">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Transaction
              </Button>
            }
            categories={data?.categories || []}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              <p className="text-slate-400">Loading transactions...</p>
            </div>
          </div>
        ) : !data?.transactions || data.transactions.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700/50">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-slate-800/50 w-24 h-24 flex items-center justify-center mb-6 border border-slate-700/50">
                <Receipt className="h-12 w-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Transactions Yet
              </h3>
              <p className="text-slate-400 max-w-sm">
                Start tracking your financial movements by adding your first
                transaction. Click the "New Transaction" button above to begin.
              </p>
            </div>
          </Card>
        ) : (
          <TransactionsList
            transactions={data.transactions}
            categories={data.categories}
          />
        )}
      </div>
    </div>
  );
}

export default TransactionsPage;
