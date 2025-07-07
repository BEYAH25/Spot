import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const url = getSpotifyAuthUrl('destination');
  return NextResponse.redirect(url);
} 