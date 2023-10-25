'server-only';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { NextAuthOptions as NextAuthConfig } from 'next-auth';
import { getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

import omit from 'lodash-es/omit';

import { generateHash, secureCompare } from '~/server/utils/password';
import { db } from '~/server/db/prisma';
import { AUTH_CRDENTIALS_USER_SELECT } from '~/server/db/selector/user.selector';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
  }
}

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials) {
        console.log('credentials: ', credentials);
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: {
              username: credentials.username,
            },
            select: AUTH_CRDENTIALS_USER_SELECT,
          });

          console.log('user: ', user);

          if (!user) {
            return null;
          }

          if (user.password && user.salt) {
            if (
              !secureCompare(
                user.password,
                generateHash(credentials.password, user.salt),
              )
            ) {
              return null;
            }
          }

          return omit(user, ['password', 'salt', 'createdAt']);
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    verifyRequest: '/signin',
    error: '/signin', // Error code passed in query string as ?error=
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        // @ts-expect-error
        id: token.sub,
        // @ts-expect-error
        username: token?.user?.username,
        // @ts-expect-error
        bio: token?.user?.bio ?? undefined,
        // @ts-expect-error
        onboarded: token?.user?.onboarded ?? undefined,
      };
      return session;
    },
  },
  adapter: PrismaAdapter(db),
} satisfies NextAuthConfig;

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string | undefined;
      username: string;
      email: string | undefined;
      image: string | undefined;
      onboarded: boolean;
      bio: string | undefined;
    };
  } | null>;
}
