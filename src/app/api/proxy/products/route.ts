import { NextRequest, NextResponse } from "next/server";
import { getApiToken } from "../getToken";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "API_BASE_URL not set" }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term");
  const locationId = searchParams.get("locationId");
  const token = await getApiToken();
  const url = `${baseUrl}/v1/products?filter.term=${encodeURIComponent(term || "")}&filter.locationId=${encodeURIComponent(locationId || "")}`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API error:", res.status, text);
    return NextResponse.json({ error: text, status: res.status }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
} 