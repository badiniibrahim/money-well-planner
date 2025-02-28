"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserSettings } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import {
  Loader2,
  Settings2,
  Sliders,
  BellRing,
  Globe2,
  Palette,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import UserSettingsForm from "./_components/UserSettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SettingsPage() {
  const {
    data: settings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getUserSettings"],
    queryFn: () => getUserSettings(),
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
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-2 rounded-lg shadow-lg border border-slate-700/50">
                <Settings2 className="h-6 w-6 text-slate-300" />
              </div>
              <h1 className="text-4xl font-bold text-white">Settings</h1>
            </div>
            <p className="text-slate-400 ml-1">
              Customize your experience and manage your preferences
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-slate-700 border-t-slate-400 animate-spin"></div>
                <Loader2 className="h-8 w-8 text-slate-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-400">Loading your settings...</p>
            </div>
          </div>
        ) : !settings ? (
          <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30 pointer-events-none"></div>
            <div className="relative flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-gradient-to-br from-slate-800 to-slate-900 w-24 h-24 flex items-center justify-center mb-6 border border-slate-700/50 shadow-xl">
                <Settings2 className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Settings Found
              </h3>
              <p className="text-slate-400 max-w-sm">
                Let's set up your preferences to customize your experience.
                Configure your settings to make the application work best for
                you.
              </p>
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="general" className="space-y-8">
            <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg p-1.5 border border-slate-800 inline-block">
              <TabsList className="grid grid-cols-3 bg-transparent gap-1">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-slate-700 data-[state=active]:to-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-none text-slate-300 bg-slate-800/50 border border-slate-700/50"
                >
                  <Globe2 className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-slate-700 data-[state=active]:to-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-none text-slate-300 bg-slate-800/50 border border-slate-700/50"
                >
                  <BellRing className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="budget"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-slate-700 data-[state=active]:to-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-none text-slate-300 bg-slate-800/50 border border-slate-700/50"
                >
                  <Sliders className="h-4 w-4 mr-2" />
                  Budget Rules
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 via-slate-700/5 to-slate-600/5 rounded-xl pointer-events-none"></div>
              <div className="relative">
                <TabsContent value="general" className="mt-0">
                  <UserSettingsForm settings={settings} activeTab="general" />
                </TabsContent>
                <TabsContent value="notifications" className="mt-0">
                  <UserSettingsForm
                    settings={settings}
                    activeTab="notifications"
                  />
                </TabsContent>
                <TabsContent value="budget" className="mt-0">
                  <UserSettingsForm settings={settings} activeTab="budget" />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
