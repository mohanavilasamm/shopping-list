import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type AuthenticatedHandler = (
  request: NextRequest,
  session: any
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
