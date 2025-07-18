import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface SessionUser {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthSession {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    // Other session properties from better-auth
  };
  user: SessionUser;
}

type AuthenticatedHandler = (
  request: NextRequest,
  session: AuthSession
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async function(request: NextRequest) {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(request, session);
  };
}
