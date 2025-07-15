"use client";
import { AppBar } from "@/components/ui/app-bar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBar />
      {children}
    </>
  );
} 