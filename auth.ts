import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        console.log("credentials ----", credentials);
        const user = (await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        })) as any;
        console.log("user", user);

        if (!user) {
          throw new Error("No user found with the email");
        }

        const isValid = await bcrypt.compare(
          credentials?.password,
          user?.password
        );

        if (!isValid) {
          throw new Error(
            "email and password do not match. Invalid credentials"
          );
        }
        return {
          id: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified
            ? new Date(user.emailVerified)
            : null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object") {
        token.id = user.id as string;
        token.name = [user.firstName, user.lastName].filter(Boolean).join(" ");
        token.phoneNumber = user.phoneNumber;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      console.log("✅ Returning token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("⚙️ session callback fired with token:", token);

      // Make sure these fields exist
      if (token) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.phoneNumber = token.phoneNumber;
          session.user.firstName = token.firstName;
          session.user.lastName = token.lastName;
          session.user.role = token.role;
          session.user.emailVerified = token.emailVerified ?? null; 
      }
      console.log("✅ Returning session:", session);
      return session;
    },
  },

  // secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
      name?: string;
      emailVerified?: Date | null;
    };
  }

  interface User {
    id: string;
    email: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    name?: string;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    name?: string;
    emailVerified?: Date | null;
  }
}
