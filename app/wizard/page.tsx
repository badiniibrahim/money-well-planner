import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { CurrencyComBox } from "./_components/CurrencyComBox";

async function WizardPage() {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 flex flex-col items-center space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gradient from-purple-500 to-indigo-500">
          Welcome, <span className="font-bold">{user.firstName}!</span>
        </h1>
        <p className="text-lg text-gray-500">
          Let’s get started by setting up your currency.
        </p>
        <p className="text-sm text-gray-400">
          You can change these settings anytime.
        </p>
      </div>

      <Card className="w-full bg-gradient-to-r from-gray-50 to-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Currency
          </CardTitle>
          <CardDescription className="text-gray-500">
            Set your default currency for transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <CurrencyComBox />
        </CardContent>
      </Card>

      <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105">
        <Link href="/" className="block w-full text-center">
          I’m done! Take me to the dashboard
        </Link>
      </Button>
    </div>
  );
}

export default WizardPage;
