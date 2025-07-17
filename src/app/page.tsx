"use client";

import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"

import { LoginForm } from "@/components/ui/login-form"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  // TODO: Replace with actual authentication check
  const isLoggedIn = false; // Replace with real auth state

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/shopping-list");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Shopping List
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden h-full w-full bg-muted lg:block">
        <Image
          src="/login.jpg"
          alt="Background"
          fill
          priority
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}