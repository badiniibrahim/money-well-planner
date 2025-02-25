import { UserButton } from "@clerk/nextjs";
import React from "react";

function DashboardHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-800 p-5 shadow-md flex justify-end gap-3 items-center rounded-b-lg">
      <h1 className="text-white text-lg font-semibold flex-grow text-center">
        Virtual Health Assistant
      </h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default DashboardHeader;
