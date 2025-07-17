"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AppBar() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  return (
    <header className="w-full flex items-center justify-end gap-4 px-6 py-3 bg-black text-primary-foreground">
      <span className="flex items-center gap-2">
        {user?.image ? (
          <Image 
            src={user.image} 
            alt={user.name || "User"} 
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border"
            priority
          />
        ) : (
          <div className="w-8 h-8 rounded-full border bg-muted" />
        )}
        <span className="font-medium">
          {user?.name || user?.email || "Guest"}
        </span>
      </span>
      {user ? (
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-gray-700"
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
        >
          Sign Out
        </Button>
      ) : null}
    </header>
  );
} 