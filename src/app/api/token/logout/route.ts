import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('spotify_source_token', '', { path: '/', maxAge: 0 });
  res.cookies.set('spotify_destination_token', '', { path: '/', maxAge: 0 });
  return res;
} 