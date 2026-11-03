"use client";

import { useEffect, useRef, useState } from "react";

type Song = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  spotifyId?: string;
  previewUrl?: string;
  jamendoUrl?: string;
};

type NewsItem = {
  id: number;
  title: string;
  url: string;
  by?: string;
  time?: number;
};

const initialSongs: Song[] = [
  { id: 1, title: "Pinter Nyangkut", artist: "Imaha Productions", spotifyId: "0qnDeREhVYY8hBVX6P5DEU", duration: "3:17" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", spotifyId: "0VjIjW4GlUZAMYd2vXMi3b", previewUrl: "https://p.scdn.co/mp3-preview/7f2da33e18f84ed6b5a02e783e57b3df65f09fbc", duration: "3:20" },
  { id: 3, title: "Watermelon Sugar", artist: "Harry Styles", spotifyId: "6UelLqGlWMcVH1E5c4H7lY", previewUrl: "https://p.scdn.co/mp3-preview/5e0e3a3e4d8e5a8e8e1c5f2c5e1a5c5e5a8e5c1a", duration: "2:54" },
  { id: 4, title: "Bad Guy", artist: "Billie Eilish", spotifyId: "2Fxmhks0bxGSBdJ92vM42m", previewUrl: "https://p.scdn.co/mp3-preview/1ad8fcd9f0f0e7d0d5e5c5a5b5e5d5e5c5a5b5e5", duration: "3:14" },
  { id: 5, title: "As It Was", artist: "Harry Styles", spotifyId: "3jjujdWJ72nww5eGnfs2E7", previewUrl: "https://p.scdn.co/mp3-preview/f1f5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5", duration: "2:47" },
  { id: 6, title: "Shape of You", artist: "Ed Sheeran", spotifyId: "7qiZfU4dY1lWllzX7mPBI3", previewUrl: "https://p.scdn.co/mp3-preview/a5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5", duration: "3:53" },
  { id: 7, title: "Levitating", artist: "Dua Lipa", spotifyId: "39LLxExYz6ewLAcYrzQQyP", previewUrl: "https://p.scdn.co/mp3-preview/c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5", duration: "3:23" },
  { id: 8, title: "Flowers", artist: "Miley Cyrus", spotifyId: "0yLdNVWF3Srea0uzk55zFn", previewUrl: "https://p.scdn.co/mp3-preview/5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e", duration: "3:20" },
  { id: 9, title: "Stay", artist: "The Kid LAROI & Justin Bieber", spotifyId: "5HCyWlXZPP0y6Gqq8TgA20", previewUrl: "https://p.scdn.co/mp3-preview/d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d", duration: "2:21" },
  { id: 10, title: "Someone You Loved", artist: "Lewis Capaldi", spotifyId: "7qEHsqek33rTcFNT9PFqLf", previewUrl: "https://p.scdn.co/mp3-preview/e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e", duration: "3:02" },
  { id: 11, title: "Señorita", artist: "Shawn Mendes & Camila Cabello", spotifyId: "6v3KW9xbzN5yKLt9YKDYA2", previewUrl: "https://p.scdn.co/mp3-preview/5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5", duration: "3:10" },
  { id: 12, title: "Perfect", artist: "Ed Sheeran", spotifyId: "0tgVpDi06FyKpA1z0VMD4v", previewUrl: "https://p.scdn.co/mp3-preview/b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b", duration: "4:23" },
  { id: 13, title: "Happier", artist: "Marshmello & Bastille", spotifyId: "2dpaYNEQHiRxtZbfNsse99", previewUrl: "https://p.scdn.co/mp3-preview/c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c5a5b5e5d5c", duration: "3:34" },
];

export default function SecondaryContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [spotifyStatus, setSpotifyStatus] = useState("Loading Spotify tracks...");
  const [localPlaying, setLocalPlaying] = useState(false);
  const [activeSongId, setActiveSongId] = useState<number | null>(null);
  const [playerMinimized, setPlayerMinimized] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [embedTrackId, setEmbedTrackId] = useState<string | null>(null);
  const [embedVersion, setEmbedVersion] = useState(0);
  const newsSectionRef = useRef<HTMLElement | null>(null);
  const musicSectionRef = useRef<HTMLElement | null>(null);
  const newsCarouselRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spotifyTracksLoadStarted = useRef(false);
  const newsLoadStarted = useRef(false);

  const activeSong = songs.find((song) => song.id === activeSongId) ?? null;
  const playerTitle = activeSong ? `${activeSong.title} · ${activeSong.artist}` : "Select a song to play";

  const fetchNews = async () => {
    setLoadingNews(true);
    setNewsError(null);
    try {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      if (!response.ok) throw new Error(`News request failed with status ${response.status}`);
      const ids: number[] = await response.json();
      const items = await Promise.all(
        ids.slice(0, 12).map(async (id) => {
          const itemResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (!itemResponse.ok) throw new Error(`News item request failed with status ${itemResponse.status}`);
          return itemResponse.json();
        })
      );
      setNews(
        items
          .filter(Boolean)
          .map((item) => ({
            id: item.id,
            title: item.title,
            url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            by: item.by,
            time: item.time,
          }))
          .sort((a, b) => (b.time ?? 0) - (a.time ?? 0))
      );
    } catch (error) {
      console.error("Unable to fetch the latest tech news.", error);
      setNewsError("Failed to load news");
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchSpotifyTracks = async () => {
    setSpotifyStatus("Loading Spotify tracks...");
    try {
      const response = await fetch("/api/spotify/tracks");
      if (!response.ok) throw new Error(`Spotify tracks request failed with status ${response.status}`);
      const data = await response.json();
      if (data?.tracks?.length) {
        const tracks = (data.tracks as Song[])
          .filter((track) => track.title !== "Pinter Nyangkut" || track.artist !== "Imaha Productions")
          .map((track, index) => ({ ...track, id: index + 2 }));
        setSongs([initialSongs[0], ...tracks]);
        setSpotifyStatus(`Loaded ${tracks.length} Spotify tracks`);
      } else {
        setSpotifyStatus("No Spotify tracks returned");
      }
    } catch (error) {
      console.error("Unable to load Spotify tracks.", error);
      setSpotifyStatus("Unable to load Spotify tracks");
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.onended = () => setLocalPlaying(false);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const newsSection = newsSectionRef.current;
    const musicSection = musicSectionRef.current;
    if (!newsSection || !musicSection) return;

    const loadNews = () => {
      if (newsLoadStarted.current) return;
      newsLoadStarted.current = true;
      void fetchNews();
    };

    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => {
        loadNews();
        spotifyTracksLoadStarted.current = true;
        void fetchSpotifyTracks();
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const newsObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loadNews();
        newsObserver.disconnect();
      },
      { rootMargin: "300px 0px" }
    );
    const musicObserver = new IntersectionObserver(
      ([entry]) => {
        setPlayerVisible(entry.isIntersecting);
        if (!entry.isIntersecting || spotifyTracksLoadStarted.current) return;
        spotifyTracksLoadStarted.current = true;
        void fetchSpotifyTracks();
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    newsObserver.observe(newsSection);
    musicObserver.observe(musicSection);
    return () => {
      newsObserver.disconnect();
      musicObserver.disconnect();
    };
  }, []);

  const handleSelectSong = async (songId: number) => {
    setActiveSongId(songId);
    setPlayerMinimized(false);
    const song = songs.find((item) => item.id === songId);
    if (!song) return;

    if (!song.jamendoUrl && !song.previewUrl && !song.spotifyId) {
      setSpotifyStatus(`No playable source for: ${song.title}`);
      return;
    }

    if (song.jamendoUrl) {
      playLocalUrl(song.jamendoUrl);
      return;
    }

    if (song.previewUrl) {
      try {
        const audio = new Audio(song.previewUrl);
        audioRef.current?.pause();
        audioRef.current = audio;
        audio.load();
        await audio.play();
        setLocalPlaying(true);
        setSpotifyStatus(`Now playing: ${song.title}`);
      } catch {
        setLocalPlaying(false);
        if (song.spotifyId) {
          setEmbedTrackId(song.spotifyId);
          setEmbedVersion((value) => value + 1);
        }
        setSpotifyStatus(`Preview unavailable for: ${song.title}`);
      }
      return;
    }

    if (song.spotifyId) {
      setEmbedTrackId(song.spotifyId);
      setEmbedVersion((value) => value + 1);
      setSpotifyStatus(`Loading ${song.title}...`);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current || !activeSong) return;
    if (!activeSong.jamendoUrl && !activeSong.previewUrl && !activeSong.spotifyId) {
      setSpotifyStatus(`No playable source for: ${activeSong.title}`);
      return;
    }

    if (activeSong.jamendoUrl) {
      if (localPlaying) {
        audioRef.current.pause();
        setLocalPlaying(false);
      } else {
        await audioRef.current.play();
        setLocalPlaying(true);
      }
      return;
    }

    if (activeSong.previewUrl) {
      try {
        if (localPlaying) {
          audioRef.current.pause();
          setLocalPlaying(false);
        } else {
          audioRef.current.src = activeSong.previewUrl;
          audioRef.current.load();
          await audioRef.current.play();
          setLocalPlaying(true);
          setSpotifyStatus(`Now playing: ${activeSong.title}`);
        }
      } catch {
        setLocalPlaying(false);
        if (activeSong.spotifyId) {
          setEmbedTrackId(activeSong.spotifyId);
          setEmbedVersion((value) => value + 1);
        }
        setSpotifyStatus("Preview unavailable");
      }
      return;
    }

    if (activeSong.spotifyId) {
      setEmbedTrackId(activeSong.spotifyId);
      setEmbedVersion((value) => value + 1);
      setPlayerMinimized(false);
      setSpotifyStatus(`Now playing: ${activeSong.title}`);
    }
  };

  const changeTrack = (direction: -1 | 1) => {
    if (!activeSong) return;
    const index = songs.findIndex((song) => song.id === activeSong.id);
    const nextSong = songs[(index + direction + songs.length) % songs.length];
    if (!nextSong) return;
    setActiveSongId(nextSong.id);
    setEmbedTrackId(nextSong.spotifyId ?? null);
    setEmbedVersion((value) => value + 1);
    setPlayerMinimized(false);
  };

  const playLocalUrl = (url: string) => {
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = url;
    void audioRef.current.play().catch(() => setSpotifyStatus("Failed to play audio"));
    setLocalPlaying(true);
    audioRef.current.onended = () => setLocalPlaying(false);
  };

  const scrollNews = (direction: -1 | 1) => {
    newsCarouselRef.current?.scrollBy({ left: direction * 336, behavior: "smooth" });
  };

  return (
    <>
      <section id="news" ref={newsSectionRef} className="min-h-[500px] bg-[var(--surface)] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <h2 className="mb-6 text-2xl font-bold text-[var(--foreground)]">Latest Tech News</h2>
            <button type="button" onClick={() => void fetchNews()} className="rounded-md border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface)]/90">
              Refresh
            </button>
          </div>
          <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4">
            {loadingNews ? (
              <p className="text-[var(--muted)]">Loading news...</p>
            ) : newsError ? (
              <p className="text-sm text-red-400">{newsError}</p>
            ) : news.length === 0 ? (
              <p className="text-[var(--muted)]">No news available.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-2 top-1/2 z-20 -translate-y-1/2">
                  <button type="button" onClick={() => scrollNews(-1)} className="rounded-full bg-[var(--surface)]/80 p-2 text-[var(--foreground)] shadow-sm hover:bg-[var(--surface)]" aria-label="Previous">
                    ‹
                  </button>
                </div>
                <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2">
                  <button type="button" onClick={() => scrollNews(1)} className="rounded-full bg-[var(--surface)]/80 p-2 text-[var(--foreground)] shadow-sm hover:bg-[var(--surface)]" aria-label="Next">
                    ›
                  </button>
                </div>
                <div ref={newsCarouselRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-2 py-2" style={{ WebkitOverflowScrolling: "touch" }}>
                  {news.map((item) => {
                    let domain = "";
                    try {
                      domain = new URL(item.url).hostname.replace("www.", "");
                    } catch {
                      domain = "";
                    }
                    return (
                      <article key={item.id} className="flex w-[320px] shrink-0 snap-start flex-col justify-between gap-3 overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--background)] shadow-sm">
                        <div className="flex h-36 items-end bg-gradient-to-br from-blue-500/8 to-cyan-500/6 p-3">
                          {domain && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`https://icons.duckduckgo.com/ip3/${domain}.ico`} alt="" className="h-10 w-10 rounded-md border border-[var(--surface-border)] bg-white/5" loading="lazy" />
                          )}
                          <div className="ml-3 text-xs text-[var(--muted)]">{domain}</div>
                        </div>
                        <div className="p-4">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--brand-text)] hover:underline">{item.title}</a>
                          <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted)]">
                            <span>by {item.by ?? "unknown"}</span>
                            <span>•</span>
                            <span>{item.time ? new Date(item.time * 1000).toLocaleString() : ""}</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section id="music" ref={musicSectionRef} className="min-h-[480px] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">My New Songs - Released</p>
                <h2 className="text-4xl font-bold text-[var(--foreground)]">Minimal music for your focus</h2>
                <p className="max-w-2xl text-[var(--muted)]">Browse the new song list and keep playback running while you explore the page. Tap a track to start and control playback from the floating player.</p>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-[var(--surface-border)] bg-[var(--background)]/70 p-4 text-sm text-[var(--foreground)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-[var(--brand-text)]">♪</div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--foreground)]">Now Playing</p>
                  <p className="truncate text-[var(--muted)]">{playerTitle}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => {
                spotifyTracksLoadStarted.current = true;
                void fetchSpotifyTracks();
              }} className="inline-flex items-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Load Spotify tracks</button>
              <p className="text-sm text-[var(--muted)]">{spotifyStatus}</p>
            </div>
            <div className="mt-8 max-h-64 space-y-2 overflow-y-auto rounded-2xl border border-[var(--surface-border)] p-4">
              {songs.map((song) => {
                const isActive = activeSongId === song.id;
                const isCurrentlyPlaying = isActive && localPlaying;
                return (
                  <button key={song.id} type="button" onClick={() => void handleSelectSong(song.id)} className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition ${isCurrentlyPlaying ? "border border-cyan-400/50 bg-cyan-500/15" : isActive ? "border border-cyan-400/30 bg-cyan-500/10" : "border border-[var(--surface-border)] bg-[var(--background)] hover:border-cyan-400/30 hover:bg-[var(--surface)]"}`}>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">{song.title}</h3>
                      <p className="truncate text-xs text-[var(--muted)]">{song.artist}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {isCurrentlyPlaying && <span className="text-xs font-semibold text-cyan-400">▶</span>}
                      <span className="text-xs text-[var(--muted)]">{song.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <div className={`fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[440px] px-4 pb-4 transition-all duration-200 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 ${playerVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`} aria-hidden={!playerVisible}>
        <div className={`overflow-hidden rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface)]/95 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.85)] backdrop-blur-xl transition-all duration-200 ${playerMinimized ? "h-[72px]" : ""}`}>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[var(--muted)]">Now playing</p>
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">{playerTitle}</p>
            </div>
            <button type="button" onClick={() => setPlayerMinimized((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] transition hover:border-cyan-400" aria-label={playerMinimized ? "Expand player" : "Minimize player"}>
              {playerMinimized ? "▴" : "▾"}
            </button>
          </div>
          {!playerMinimized && (
            <div className="border-t border-[var(--surface-border)] px-4 py-4">
              {activeSong ? (
                <div className="space-y-3">
                  <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
                    {activeSong.spotifyId || embedTrackId ? (
                      <div className="overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-black/10">
                        <iframe key={embedVersion} src={`https://open.spotify.com/embed/track/${embedTrackId ?? activeSong.spotifyId ?? ""}?autoplay=1&view=coverart`} width="100%" height="80" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="border-0" title={`Spotify player for ${activeSong.title}`} />
                      </div>
                    ) : (
                      <p>{spotifyStatus}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <button type="button" onClick={() => changeTrack(-1)} className="inline-flex items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--background)] p-2 text-[var(--foreground)] transition hover:border-cyan-400">◀◀</button>
                    <button type="button" onClick={() => void togglePlay()} className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400">{localPlaying ? "Pause track" : "Play track"}</button>
                    <button type="button" onClick={() => changeTrack(1)} className="inline-flex items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--background)] p-2 text-[var(--foreground)] transition hover:border-cyan-400">▶▶</button>
                  </div>
                  <p className="text-xs text-[var(--muted)]">{spotifyStatus}</p>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">Select a song to open the player.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
