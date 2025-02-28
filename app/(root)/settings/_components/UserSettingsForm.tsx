"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserSettings } from "../_actions/actions";
import {
  Settings2,
  Globe,
  Sun,
  Moon,
  Mail,
  Bell,
  FileText,
  Loader2,
  DollarSign,
  Check,
  CreditCard,
  Languages,
  Palette,
  BellRing,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currencies } from "@/constants";
import BudgetRuleSettings from "./BudgetRuleSettings";

interface BudgetRules {
  id: number;
  needsPercentage: number;
  savingsPercentage: number;
  wantsPercentage: number;
  actualNeedsPercentage: number;
  actualSavingsPercentage: number;
  actualWantsPercentage: number;
  clerkId: string;
}

interface UserSettings {
  id?: number;
  currency?: string;
  language?: string;
  theme?: string;
  emailNotifications?: boolean;
  budgetAlerts?: boolean;
  weeklyReports?: boolean;
  clerkId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  budgetRules?: BudgetRules | null;
}

interface Props {
  settings: UserSettings;
  activeTab?: string;
}

function UserSettingsForm({ settings, activeTab = "general" }: Props) {
  const [formData, setFormData] = React.useState({
    currency: settings.currency || "USD",
    language: settings.language || "en",
    theme: settings.theme || "dark",
    emailNotifications: settings.emailNotifications ?? true,
    budgetAlerts: settings.budgetAlerts ?? true,
    weeklyReports: settings.weeklyReports ?? true,
  });

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      toast.success("Settings updated successfully", {
        description: "Your preferences have been saved.",
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["getUserSettings"] });
    },
    onError: () => {
      toast.error("Failed to update settings", {
        description: "Please try again later.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (activeTab === "budget") {
    return <BudgetRuleSettings budgetRules={settings.budgetRules} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {activeTab === "general" && (
          <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-700/10 pointer-events-none"></div>
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
                  <Settings2 className="h-5 w-5 text-slate-300" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  General Settings
                </h2>
              </div>

              <div className="space-y-8">
                {/* Currency */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
                      <CreditCard className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Currency
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Choose your preferred currency for financial
                        calculations
                      </p>
                    </div>
                  </div>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:ring-slate-500">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {Currencies.map((currency) => (
                        <SelectItem
                          key={currency.value}
                          value={currency.value}
                          className="text-slate-200 focus:bg-slate-700 focus:text-white"
                        >
                          {currency.label} ({currency.value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
                      <Languages className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Language
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Select your preferred language for the interface
                      </p>
                    </div>
                  </div>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:ring-slate-500">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem
                        value="en"
                        className="text-slate-200 focus:bg-slate-700 focus:text-white"
                      >
                        English
                      </SelectItem>
                      <SelectItem
                        value="fr"
                        className="text-slate-200 focus:bg-slate-700 focus:text-white"
                      >
                        Français
                      </SelectItem>
                      <SelectItem
                        value="es"
                        className="text-slate-200 focus:bg-slate-700 focus:text-white"
                      >
                        Español
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Theme */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
                      <Palette className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">Theme</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Choose between light and dark mode for the interface
                      </p>
                    </div>
                  </div>
                  <Select
                    value={formData.theme}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:ring-slate-500">
                      <SelectValue placeholder="Select theme">
                        <div className="flex items-center gap-2">
                          {formData.theme === "dark" ? (
                            <Moon className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Sun className="h-4 w-4 text-slate-400" />
                          )}
                          <span>
                            {formData.theme === "dark" ? "Dark" : "Light"}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem
                        value="light"
                        className="text-slate-200 focus:bg-slate-700 focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="dark"
                        className="text-slate-200 focus:bg-slate-700 focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-700/10 pointer-events-none"></div>
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
                  <BellRing className="h-5 w-5 text-slate-300" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-8">
                {/* Email Notifications */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
                      <Mail className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Email Notifications
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Receive important updates and alerts via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-slate-600 data-[state=checked]:to-slate-700"
                  />
                </div>

                {/* Budget Alerts */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
                      <Bell className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Budget Alerts
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Get notified when you approach budget thresholds
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.budgetAlerts}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        budgetAlerts: checked,
                      }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-slate-600 data-[state=checked]:to-slate-700"
                  />
                </div>

                {/* Weekly Reports */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/20 p-2.5 border border-slate-700/30">
                      <FileText className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Weekly Reports
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Receive weekly financial summaries and insights
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.weeklyReports}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        weeklyReports: checked,
                      }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-slate-600 data-[state=checked]:to-slate-700"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {(activeTab === "general" || activeTab === "notifications") && (
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-slate-700/20 transform hover:translate-y-[-2px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 border border-slate-700/50"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}

export default UserSettingsForm;
