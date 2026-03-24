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

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${process.env.BETTER_AUTH_URL}/reset-password?token=${token}`;

      await sendEmail({
        to: user.email,
        subject: "Reset your password — N8N Clone",
        html: resetPasswordTemplate(resetUrl),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const verifyUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}`;

      await sendEmail({
        to: user.email,
        subject: "Verify your email — N8N Clone",
        html: verificationEmailTemplate(verifyUrl),
      });
    },
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
              productId: "9e775e44-82c2-4217-8f18-e883661aa6c2",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
