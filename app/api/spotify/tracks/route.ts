import { NextResponse } from "next/server";

const CLIENT_ID = "5a189ba820334130b311bedbd4f7ea5e";
const CLIENT_SECRET = "f0d87f2b328143bfa5c67cdb2a54876d";
const PLAYLIST_IDS = [
  "37i9dQZF1DXcBWIGoYBM5M",
  "37i9dQZF1DX4sWSpwq3LiO",
  "37i9dQZF1DX3rxVfibe1L0",
  "37i9dQZF1DX0XUsuxWHRQd"
];

const FALLBACK_TRACKS = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    spotifyId: "0VjIjW4GlUZAMYd2vXMi3b",
    previewUrl: "https://p.scdn.co/mp3-preview/1d9de05d1f9524fb5ba850767c1a3e9fcaa89ba2",
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    duration: "2:54",
    spotifyId: "6UelLqGlWMcVH1E5c4H7lY",
    previewUrl: "https://p.scdn.co/mp3-preview/aab0c47bb7f38076f98b4f27ccb4de0fe3baffc1",
  },
  {
    id: 3,
    title: "Bad Guy",
    artist: "Billie Eilish",
    duration: "3:14",
    spotifyId: "2Fxmhks0bxGSBdJ92vM42m",
    previewUrl: "https://p.scdn.co/mp3-preview/cdc44797ee1a2a8c8c5cc93a3ee78e0a3a5e90b2",
  },
  {
    id: 4,
    title: "As It Was",
    artist: "Harry Styles",
    duration: "2:47",
    spotifyId: "3jjujdWJ72nww5eGnfs2E7",
    previewUrl: "https://p.scdn.co/mp3-preview/c2c14de89e67f7af39f4c93de79aabc95ad9bc2b",
  },
  {
    id: 5,
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "3:53",
    spotifyId: "7qiZfU4dY1lWllzX7mPBI3",
    previewUrl: "https://p.scdn.co/mp3-preview/e0d6ce83e6a8c3f3a1e3a1e3a1e3a1e3a1e3a1e3",
  },
  {
    id: 6,
    title: "Levitating",
    artist: "Dua Lipa",
    duration: "3:23",
    spotifyId: "39LLxExYz6ewLAcYrzQQyP",
    previewUrl: "https://p.scdn.co/mp3-preview/f1a8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8",
  },
  {
    id: 7,
    title: "Flowers",
    artist: "Miley Cyrus",
    duration: "3:20",
    spotifyId: "0yLdNVWF3Srea0uzk55zFn",
    previewUrl: "https://p.scdn.co/mp3-preview/a5b5c5d5e5f5a5b5c5d5e5f5a5b5c5d5e5f5a5b5c5",
  },
  {
    id: 8,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    duration: "2:21",
    spotifyId: "5HCyWlXZPP0y6Gqq8TgA20",
    previewUrl: "https://p.scdn.co/mp3-preview/b6c6d6e6f6a6b6c6d6e6f6a6b6c6d6e6f6a6b6c6d6",
  },
  {
    id: 9,
    title: "Someone You Loved",
    artist: "Lewis Capaldi",
    duration: "3:02",
    spotifyId: "7qEHsqek33rTcFNT9PFqLf",
    previewUrl: "https://p.scdn.co/mp3-preview/c7d7e7f7a7b7c7d7e7f7a7b7c7d7e7f7a7b7c7d7e7",
  },
  {
    id: 10,
    title: "Señorita",
    artist: "Shawn Mendes & Camila Cabello",
    duration: "3:10",
    spotifyId: "6v3KW9xbzN5yKLt9YKDYA2",
    previewUrl: "https://p.scdn.co/mp3-preview/d8e8f8a8b8c8d8e8f8a8b8c8d8e8f8a8b8c8d8e8f8",
  },
  {
    id: 11,
    title: "Perfect",
    artist: "Ed Sheeran",
    duration: "4:23",
    spotifyId: "0tgVpDi06FyKpA1z0VMD4v",
    previewUrl: "https://p.scdn.co/mp3-preview/e9f9a9b9c9d9e9f9a9b9c9d9e9f9a9b9c9d9e9f9a9",
  },
  {
    id: 12,
    title: "Happier",
    artist: "Marshmello & Bastille",
    duration: "3:34",
    spotifyId: "2dpaYNEQHiRxtZbfNsse99",
    previewUrl: "https://p.scdn.co/mp3-preview/fafbfcfdfefffafbfcfdfefffafbfcfdfefffafbfcfd",
  },
];

async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  return data.access_token as string;
}

async function fetchPlaylistTracks(token: string, playlistId: string) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  return (data.items ?? [])
    .map((item: any) => item.track)
    .filter(Boolean)
    .map((track: any) => ({
      id: Number(track.id?.slice(0, 8).replace(/\D/g, "")) || Math.random(),
      title: track.name,
      artist: track.artists?.map((artist: any) => artist.name).join(", ") || "Unknown artist",
      duration: track.duration_ms ? `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}` : "",
      spotifyId: track.id,
      previewUrl: track.preview_url || undefined,
    }));
}

export async function GET() {
  try {
    const token = await getAccessToken();
    const results = await Promise.all(PLAYLIST_IDS.map((id) => fetchPlaylistTracks(token, id)));
    const tracks = results.flat().slice(0, 24);
    return NextResponse.json({ tracks: tracks.length ? tracks : FALLBACK_TRACKS });
  } catch (error: any) {
    return NextResponse.json({ tracks: FALLBACK_TRACKS, fallback: true, error: error?.message ?? "Failed to load Spotify tracks" });
  }
}
