import { NextRequest, NextResponse } from 'next/server';
import { getPlaylists, getPlaylistTracks, createPlaylist, addTracksToPlaylist, getAllLikedSongs, saveTracks, getAllAlbums, saveAlbums } from '@/lib/spotify';

// TODO: Implement createPlaylist, addTracksToPlaylist, saveTracks, saveAlbums in lib/spotify

async function fetchSpotifyProfile(token: string) {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    throw new Error('Spotify API error: ' + text);
  }
  if (!res.ok) {
    throw new Error('Spotify API error: ' + (data.error?.message || JSON.stringify(data)));
  }
  return data;
}

export async function POST(req: NextRequest) {
  const cookies = req.cookies;
  const sourceToken = cookies.get('spotify_source_token')?.value;
  const destinationToken = cookies.get('spotify_destination_token')?.value;
  if (!sourceToken || !destinationToken) {
    return NextResponse.json({ error: 'Missing tokens. Please log in to both accounts.' }, { status: 400 });
  }
  const { selected } = await req.json();
  const source = JSON.parse(sourceToken);
  const destination = JSON.parse(destinationToken);
  const results: any = { playlists: [], likedSongs: null, albums: null };
  try {
    // Playlists
    if (selected.playlists && selected.playlists.length > 0) {
      // Get destination user id with robust error handling
      const destProfile = await fetchSpotifyProfile(destination.access_token);
      for (const playlistId of selected.playlists) {
        // Fetch playlist details from source
        const playlists = await getPlaylists(source.access_token);
        const playlist = playlists.find((pl: any) => pl.id === playlistId);
        if (!playlist) continue;
        // Fetch all tracks from source playlist
        const tracks = await getPlaylistTracks(source.access_token, playlistId);
        const uris = tracks.map((item: any) => item.track?.uri).filter(Boolean);
        // Create playlist in destination
        const newPlaylist = await createPlaylist(
          destination.access_token,
          destProfile.id,
          playlist.name,
          playlist.description || '',
          playlist.public
        );
        // Add tracks to new playlist
        await addTracksToPlaylist(destination.access_token, newPlaylist.id, uris);
        results.playlists.push({
          name: playlist.name,
          trackCount: uris.length,
          newPlaylistUrl: newPlaylist.external_urls.spotify,
        });
      }
    }
    // Liked Songs
    if (selected.likedSongs) {
      const liked = await getAllLikedSongs(source.access_token);
      const uris = liked.map((item: any) => item.track?.id).filter(Boolean);
      await saveTracks(destination.access_token, uris);
      results.likedSongs = { count: uris.length };
    }
    // Albums
    if (selected.albums) {
      const albums = await getAllAlbums(source.access_token);
      const ids = albums.map((item: any) => item.album?.id).filter(Boolean);
      await saveAlbums(destination.access_token, ids);
      results.albums = { count: ids.length };
    }
    return NextResponse.json({ success: 'Migration completed.', ...results });
  } catch (e: any) {
    console.error('Migration error:', e);
    return NextResponse.json({ error: e.message || 'Migration failed.' }, { status: 500 });
  }
} 