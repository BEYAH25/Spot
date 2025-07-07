import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,

    // OPTIONAL: enable (and require) email verification
    // await authClient.sendVerificationEmail({ email: "test@example.com" });
    // requireEmailVerification: true,
    // sendVerificationEmail: async ( { user, url, token }, request) => {
    //   console.log(
    //     "Sending verification email to",
    //     user.email,
    //     "with url",
    //     url
    //   );
    // },

    // OPTIONAL: enable password reset via email
    // await authClient.requestPasswordReset({ email: "test@example.com" });
    // sendResetPassword: async (url, user) => {
    //   console.log(
    //     "Sending reset password email to",
    //     user.email,
    //     "with url",
    //     url
    //   );
    // },
  },
});
import axios from 'axios';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export function getSpotifyAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/token/callback`,
    scope: [
      'user-read-email',
      'playlist-read-private',
      'playlist-modify-private',
      'playlist-modify-public',
      'user-library-read',
      'user-library-modify',
    ].join(' '),
    state,
  });
  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const res = await axios.post(
    SPOTIFY_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/token/callback`,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  return res.data;
} 