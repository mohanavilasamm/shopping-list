import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  origin: process.env.AUTH_ORIGIN!,
  emailAndPassword: {
    enabled: true,
    async sendResetPassword() {
      // Send an email to the user with a link to reset their password
    },
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,

  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,

  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   },
  // },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
});
