import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import jwt from "jsonwebtoken";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Generate a custom JWT access token after sign in
      if (account && user) {
        const payload = {
          sub: user.id,
          email: user.email || profile?.email,
          name: user.name || profile?.name,
          provider: account.provider,
        };
        token.accessToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
          expiresIn: "1h",
        });
        // Call backend API to store user data
        try {
          await fetch(
            process.env.NEXT_PUBLIC_BASE_OLLAMA_URL + "/api/save-user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.accessToken}`,
              },
              body: JSON.stringify(payload),
            }
          );
        } catch (err) {
          console.error("Failed to store user data:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send custom accessToken to the client
      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
