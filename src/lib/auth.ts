import { polar, checkout, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";
import { sendEmail } from "./email";
import {
  resetPasswordTemplate,
  verificationEmailTemplate,
} from "./email-templates";
import { env } from "./env";

export const auth = betterAuth({
  baseUrl: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${env.BETTER_AUTH_URL}/reset-password?token=${token}`;

      void sendEmail({
        to: user.email,
        subject: "Reset your password — N8N Clone",
        html: resetPasswordTemplate(resetUrl),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const verifyUrl = `${env.BETTER_AUTH_URL}/verify-email?token=${token}`;

      void sendEmail({
        to: user.email,
        subject: "Verify your email — N8N Clone",
        html: verificationEmailTemplate(verifyUrl),
      });
    },
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: env.POLAR_PRODUCT_ID,
              slug: "pro",
            },
          ],
          successUrl: env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
