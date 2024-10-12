import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  pages: {
    // Your custom pages here
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

        try {
          const response = await axios.post(`${BASE_URL}/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { access_token } = response.data;
          if (access_token) {
            return {
              access_token,
              email: credentials.email,
            };
          }
        } catch (error) {
          console.error('Login failed:', error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
