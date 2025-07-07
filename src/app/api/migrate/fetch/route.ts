import { NextRequest, NextResponse } from 'next/server';
import { getPlaylists, getLikedSongs, getAlbums } from '@/lib/spotify';

export async function POST(req: NextRequest) {
  const { type, token } = await req.json();
  if (!type || !token) {
    return NextResponse.json({ error: 'Missing type or token' }, { status: 400 });
  }
  try {
    let data = [];
    if (type === 'playlists') data = await getPlaylists(token);
    if (type === 'likedSongs') data = await getLikedSongs(token);
    if (type === 'albums') data = await getAlbums(token);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch data from Spotify' }, { status: 500 });
  }
} 