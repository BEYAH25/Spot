import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // 'source' or 'destination'
  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }
  try {
    const tokenData = await exchangeCodeForToken(code);
    const cookieName = state === 'source' ? 'spotify_source_token' : 'spotify_destination_token';
    const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/migrate`);
    res.cookies.set(cookieName, JSON.stringify(tokenData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // maxAge: 60 * 60 * 24 * 7, // 7 days
      maxAge: 60 * 15, // 1 minute

    });
    return res;
  } catch (e: any) {
    console.error('Token exchange error:', e?.response?.data || e.message || e);
    return NextResponse.json({ error: 'Token exchange failed', details: e?.response?.data || e.message || e }, { status: 500 });
  }
} 