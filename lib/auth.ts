import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your own logic
        const user = await prisma.users.findUnique({
          where: { username: credentials?.username },
        });

        if (!user) {
          throw new Error("Incorrect username or password");
        }

        const isValidPassword = await bcrypt.compare(
          credentials?.password,
          user.password_hash
        );
        return { id: user.user_id, name: user.username };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 20 * 60,
    updateAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
