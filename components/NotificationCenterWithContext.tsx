"use client";

import {
  NotificationCenter,
  NotificationProvider,
} from "@/src/infrastructure/services/NotificationCenter";
import React from "react";

export default function NotificationCenterWithContext() {
  return (
    <NotificationProvider>
      <NotificationCenter />
    </NotificationProvider>
  );
}
