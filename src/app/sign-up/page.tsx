"use client";

import { SignUp } from "@/components/ui/sign-up";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <SignUp />
      </div>
    </div>
  );
}
