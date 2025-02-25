import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import RootProvider from "@/provider/RootProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Money Well Planner",
    absolute: "Money Well Planner",
  },
  description:
    "CV CRAFT is the easiest way to create a professional resume that will help you land your dream job.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: "light" }}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RootProvider>{children}</RootProvider>
          <Toaster richColors position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
