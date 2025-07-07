import axios from 'axios';

export async function getPlaylists(token: string) {
  const res = await axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.items;
}

export async function getLikedSongs(token: string) {
  const res = await axios.get('https://api.spotify.com/v1/me/tracks?limit=50', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.items;
}

export async function getAlbums(token: string) {
  const res = await axios.get('https://api.spotify.com/v1/me/albums?limit=50', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.items;
}

export async function getPlaylistTracks(token: string, playlistId: string) {
  let tracks: any[] = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;
  while (url) {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    tracks = tracks.concat(res.data.items);
    url = res.data.next;
  }
  return tracks;
}

export async function createPlaylist(token: string, userId: string, name: string, description: string, isPublic: boolean) {
  const res = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name,
      description,
      public: isPublic,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function addTracksToPlaylist(token: string, playlistId: string, uris: string[]) {
  // Spotify allows max 100 tracks per request
  for (let i = 0; i < uris.length; i += 100) {
    const batch = uris.slice(i, i + 100);
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: batch },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}

export async function getAllLikedSongs(token: string) {
  let tracks: any[] = [];
  let url = 'https://api.spotify.com/v1/me/tracks?limit=50';
  while (url) {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    tracks = tracks.concat(res.data.items);
    url = res.data.next;
  }
  return tracks;
}

export async function saveTracks(token: string, uris: string[]) {
  // Spotify allows max 50 tracks per request
  for (let i = 0; i < uris.length; i += 50) {
    const batch = uris.slice(i, i + 50);
    await axios.put(
      'https://api.spotify.com/v1/me/tracks',
      { ids: batch },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}

export async function getAllAlbums(token: string) {
  let albums: any[] = [];
  let url = 'https://api.spotify.com/v1/me/albums?limit=50';
  while (url) {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    albums = albums.concat(res.data.items);
    url = res.data.next;
  }
  return albums;
}

export async function saveAlbums(token: string, ids: string[]) {
  // Spotify allows max 50 albums per request
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    await axios.put(
      'https://api.spotify.com/v1/me/albums',
      { ids: batch },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
} 
