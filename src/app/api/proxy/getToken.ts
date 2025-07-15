export async function getApiToken() {
  const res = await fetch(process.env.API_TOKEN_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.API_CLIENT_ID!,
      client_secret: process.env.API_CLIENT_SECRET!,
      // Add scope if needed, e.g. scope: process.env.API_SCOPE || undefined
    }),
  });
  if (!res.ok) throw new Error("Failed to get access token");
  const data = await res.json();
  return data.access_token;
} 