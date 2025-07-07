'use client'
import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Music, Heart, Album, Users, CheckCircle, XCircle, Clock, ExternalLink, RefreshCw, LogOut } from 'lucide-react';
import { SignInButton } from '@/components/AccountSelector';
import Spinner from '@/components/ui/spinner';
import { toast } from 'sonner';
import axios from 'axios';
import Loading  from './loading'

function LogoutButton() {
  return (
    <Button
      variant="default"
      size="sm"
      className="align-items-center mb-4 w-full group hover:scale-105 transition-transform"
      onClick={async () => {
        try {
          await axios.post('/api/token/logout');
          window.location.reload();
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }}
    >
      <LogOut className="w-2 h-2 mr-2" />
      Log out of both accounts
    </Button>
  );
}

function SpotifyLogoutLink() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full mb-6 border-green-400 text-green-400 hover:bg-green-400 hover:text-white group"
      onClick={() => window.open('https://accounts.spotify.com/logout', '_blank')}
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      Log out of Spotify in browser
    </Button>
  );
}

type ColorVariant = 'green' | 'blue' | 'purple' | 'red';

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
  color?: ColorVariant;
}

function StatsCard({ icon: Icon, title, count, color = "green" }: StatsCardProps) {
  const colorClasses: Record<ColorVariant, string> = {
    green: "text-green-400 bg-green-400/10 border-green-400/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    red: "text-red-400 bg-red-400/10 border-red-400/20"
  };

  return (
    <Card className={`${colorClasses[color]} border transition-all hover:scale-105 hover:shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <div>
            <p className="text-xs font-medium opacity-80">{title}</p>
            <p className="text-xl font-bold">{count}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MigratePageContent() {
  const [tokens, setTokens] = useState<{ source: any; destination: any } | null>(null);
  const [sourceData, setSourceData] = useState<any>({ playlists: [], likedSongs: [], albums: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ playlists: string[]; likedSongs: boolean; albums: boolean; artists: boolean }>({ playlists: [], likedSongs: false, albums: false, artists: false });
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<any>(null);
  const [sameAccount, setSameAccount] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    async function fetchTokensAndData() {
      setLoading(true);
      try {
        const res = await axios.get('/api/token/get');
        setTokens(res.data);
        if (res.data.source?.access_token) {
          const [playlists, likedSongs, albums] = await Promise.all([
            axios.post('/api/migrate/fetch', { type: 'playlists', token: res.data.source.access_token }),
            axios.post('/api/migrate/fetch', { type: 'likedSongs', token: res.data.source.access_token }),
            axios.post('/api/migrate/fetch', { type: 'albums', token: res.data.source.access_token }),
          ]);
          setSourceData({
            playlists: playlists.data || [],
            likedSongs: likedSongs.data || [],
            albums: albums.data || [],
          });
        }
      } catch (e: any) {
        setError('Failed to fetch tokens or data. Please log in to both accounts.');
      } finally {
        setLoading(false);
      }
    }
    fetchTokensAndData();
  }, []);

  useEffect(() => {
    async function checkSameAccount() {
      if (tokens?.source?.access_token && tokens?.destination?.access_token) {
        setProfileLoading(true);
        try {
          const [sourceProfile, destProfile] = await Promise.all([
            axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${tokens.source.access_token}` } }),
            axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${tokens.destination.access_token}` } }),
          ]);
          setSameAccount(sourceProfile.data.id === destProfile.data.id);
        } catch {
          setSameAccount(false);
        } finally {
          setProfileLoading(false);
        }
      }
    }
    checkSameAccount();
  }, [tokens]);

  function handleSelectPlaylist(id: string) {
    setSelected((prev) => ({ ...prev, playlists: prev.playlists.includes(id) ? prev.playlists.filter(pid => pid !== id) : [...prev.playlists, id] }));
  }

  function handleSelectLikedSongs(val: boolean) {
    setSelected((prev) => ({ ...prev, likedSongs: val }));
  }

  function handleSelectAlbums(val: boolean) {
    setSelected((prev) => ({ ...prev, albums: val }));
  }

  function handleSelectArtists(val: boolean) {
    setSelected((prev) => ({ ...prev, artists: val }));
  }

  function handleSelectAllPlaylists(val: boolean) {
    setSelectAll(val);
    setSelected((prev) => ({
      ...prev,
      playlists: val ? sourceData.playlists.map((pl: any) => pl.id) : [],
    }));
  }

  async function handleStartMigration() {
    setMigrating(true);
    setMigrationStatus(null);
    const toastId = toast.loading('Migration started...');
    try {
      const res = await axios.post('/api/migrate/start', {
        selected,
      });
      setMigrationStatus(res.data);
      toast.success('Migration completed!', { id: toastId });
    } catch (e: any) {
      setMigrationStatus({ error: e.response?.data?.error || e.message || 'Migration failed.' });
      toast.error('Migration failed.', { id: toastId });
    } finally {
      setMigrating(false);
    }
  }

  // Hero section
  const Hero = () => (
    <section className="w-full bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-6 p-6 flex flex-col items-center text-center border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <svg width="48" height="48" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
              <circle cx="84" cy="84" r="84" fill="#1DB954" />
              <path d="M120.1 116.2c-1.7 2.8-5.3 3.7-8.1 2-22.2-13.6-50.2-16.7-83.2-9.2-3.2.7-6.4-1.3-7.1-4.5-.7-3.2 1.3-6.4 4.5-7.1 35.5-7.9 66.2-4.4 90.5 10.4 2.8 1.7 3.7 5.3 2 8.1zm11.6-23.2c-2.1 3.4-6.5 4.5-9.9 2.4-25.4-15.6-64.2-20.1-94.2-11.1-3.8 1.1-7.8-1.1-8.9-4.9-1.1-3.8 1.1-7.8 4.9-8.9 33.8-9.8 75.1-5 103.6 12.2 3.4 2.1 4.5 6.5 2.4 9.9zm13.2-26.2c-30.1-18.1-79.7-19.8-108.2-11.1-4.4 1.3-9-1.2-10.3-5.6-1.3-4.4 1.2-9 5.6-10.3 31.8-9.5 85.1-7.6 119.7 12.2 4 2.4 5.3 7.6 2.9 11.6-2.4 4-7.6 5.3-11.6 2.9z" fill="#fff" />
            </svg>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <RefreshCw className="w-2 h-2 text-green-500" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">Migrator</h1>
        <p className="text-lg text-white/90 mb-2 max-w-2xl">Seamlessly transfer your music library between Spotify accounts</p>
        <p className="text-sm text-white/70 max-w-xl">Connect your source and destination accounts, select what to migrate, and let us handle the rest.</p>
      </div>
    </section>
  );

  // Loading state
  if (loading) {
    return <Loading/>;
  }

  return (
    <div className="min-h-screen gradient-bg text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-6xl flex-1">
        <Hero />
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Status */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-green-400">Account Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="font-medium text-sm">Source Account</span>
                    </div>
                    {tokens?.source ? (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected</span>
                      </div>
                    ) : (
                      <SignInButton label="Connect Source Account" type="source" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="font-medium text-sm">Destination Account</span>
                    </div>
                    {tokens?.destination ? (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected</span>
                      </div>
                    ) : (
                      // <SignInButton label="Connect Destination Account" type="destination" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-white group"
                        onClick={async () => {
                          const spotifyLogoutWindow = window.open('https://accounts.spotify.com/logout', '_blank');
                          setTimeout(() => {
                            spotifyLogoutWindow?.close();
                            window.location.href = '/api/token/destination';
                          }, 2000);
                        }}
                      > 
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect Destination Account
                      </Button>
                    )}
                  </div>
                </div>
                <Separator className="bg-white/10" />
                
                <div className="space-y-2">
                  <LogoutButton />
                  {/* <SpotifyLogoutLink /> */}
                </div>
              </CardContent>
            </Card>

            {/* Same Account Warning */}
            {sameAccount && !profileLoading && (
              <Alert variant="destructive" className="border-red-400/50 bg-red-400/10">
                <XCircle className="w-4 h-4" />
                <AlertTitle className="text-sm">Same Account Detected</AlertTitle>
                <AlertDescription className="text-sm">
                  You're connected to the same Spotify account for both source and destination. 
                  Please log out of Spotify in your browser and connect a different account for the destination.
                </AlertDescription>
              </Alert>
            )}

            {/* Selection Interface */}
            {tokens?.source && tokens?.destination && (
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-green-400">Select Content to Migrate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Playlists */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        Playlists
                      </h3>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAllPlaylists}
                          id="select-all"
                        />
                        <label htmlFor="select-all" className="text-xs">Select All</label>
                      </div>
                    </div>
                    
                    {sourceData.playlists.length === 0 ? (
                      <p className="text-white/50 text-center py-6 text-sm">No playlists found</p>
                    ) : (
                      <div className="grid gap-2 max-h-48 overflow-y-auto">
                        {sourceData.playlists.map((playlist: any) => (
                          <div
                            key={playlist.id}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors border border-white/10"
                          >
                            <Checkbox
                              checked={selected.playlists.includes(playlist.id)}
                              onCheckedChange={() => handleSelectPlaylist(playlist.id)}
                              id={`playlist-${playlist.id}`}
                            />
                            <div className="flex-1 min-w-0">
                              <label
                                htmlFor={`playlist-${playlist.id}`}
                                className="block font-medium truncate cursor-pointer text-sm"
                              >
                                {playlist.name}
                              </label>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-white/60">{playlist.tracks?.total || 0} tracks</span>
                                <Badge variant={playlist.public ? "default" : "secondary"} className="text-xs px-2 py-0">
                                  {playlist.public ? "Public" : "Private"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Other Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors border border-white/10">
                      <Checkbox
                        checked={selected.likedSongs}
                        onCheckedChange={handleSelectLikedSongs}
                        id="liked-songs"
                      />
                      <Heart className="w-4 h-4 text-green-400" />
                      <label htmlFor="liked-songs" className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm">Liked Songs</div>
                        <div className="text-xs text-white/60">{sourceData.likedSongs.length} songs</div>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors border border-white/10">
                      <Checkbox
                        checked={selected.albums}
                        onCheckedChange={handleSelectAlbums}
                        id="saved-albums"
                      />
                      <Album className="w-4 h-4 text-blue-400" />
                      <label htmlFor="saved-albums" className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm">Saved Albums</div>
                        <div className="text-xs text-white/60">{sourceData.albums.length} albums</div>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg opacity-50 cursor-not-allowed border border-white/10">
                      <Checkbox disabled />
                      <Users className="w-4 h-4 text-purple-400" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Followed Artists</div>
                        <div className="text-xs text-white/60">Coming soon</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Migration Results */}
            {migrationStatus && (migrationStatus.success || migrationStatus.error) && (
              <Card className={`border-white/10 ${migrationStatus.success ? 'bg-green-400/10 border-green-400/20' : 'bg-red-400/10 border-red-400/20'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-base ${migrationStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                    {migrationStatus.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {migrationStatus.success ? 'Migration Successful!' : 'Migration Failed'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {migrationStatus.success && (
                    <div className="space-y-3">
                      <p className="text-green-400 text-sm">{migrationStatus.success}</p>
                      
                      {migrationStatus.playlists && migrationStatus.playlists.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Migrated Playlists:</h4>
                          <div className="space-y-2">
                            {migrationStatus.playlists.map((playlist: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded text-sm">
                                <span>{playlist.name}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{playlist.trackCount} tracks</Badge>
                                  <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {migrationStatus.likedSongs && (
                        <div className="p-2 bg-white/5 rounded text-sm">
                          <span className="font-medium">Liked Songs:</span> {migrationStatus.likedSongs.count} migrated
                        </div>
                      )}
                      
                      {migrationStatus.albums && (
                        <div className="p-2 bg-white/5 rounded text-sm">
                          <span className="font-medium">Albums:</span> {migrationStatus.albums.count} migrated
                        </div>
                      )}
                    </div>
                  )}
                  
                  {migrationStatus.error && (
                    <p className="text-red-400 text-sm">{migrationStatus.error}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-white/90">Your Music Library</h3>
              <div className="grid gap-3">
                <StatsCard
                  icon={Music}
                  title="Playlists"
                  count={sourceData.playlists.length}
                  color="green"
                />
                <StatsCard
                  icon={Heart}
                  title="Liked Songs"
                  count={sourceData.likedSongs.length}
                  color="red"
                />
                <StatsCard
                  icon={Album}
                  title="Saved Albums"
                  count={sourceData.albums.length}
                  color="blue"
                />
              </div>
            </div>

            {/* Migration Button */}
            {tokens?.source && tokens?.destination && (
              <Card className="border-green-400/20 bg-green-400/5">
                <CardContent className="p-4">
                  <Button
                    className="w-full h-10 text-base font-bold bg-green-500 hover:bg-green-400 text-black transition-all hover:scale-105 shadow-lg"
                    onClick={handleStartMigration}
                    disabled={migrating || (!selected.playlists.length && !selected.likedSongs && !selected.albums)}
                  >
                    {migrating ? (
                      <>
                        <Spinner className="mr-2" size="sm" />
                        Migrating...
                      </>
                    ) : (
                      <>
                        <Music className="w-4 h-4 mr-2" />
                        Start Migration
                      </>
                    )}
                  </Button>
                  
                  {!migrating && (
                    <p className="text-xs text-white/60 mt-2 text-center">
                      {selected.playlists.length + (selected.likedSongs ? 1 : 0) + (selected.albums ? 1 : 0)} item(s) selected
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Migration Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-white/70">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Private playlists will be created as private in your destination account</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Liked songs will be added to your destination account's liked songs</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Migration preserves playlist order and track positions</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Large libraries may take several minutes to migrate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Footer */}
      {/* <footer className="w-full mt-8 py-4 text-center text-xs text-white/60 glass-card">
        <span>Made with <span className="text-gradient font-bold">♥</span> by you &middot; 2025</span>
      </footer> */}
    </div>
  );
}



export default function MigratePage() {
  return (
    <Suspense >
      <MigratePageContent />
    </Suspense>
  );
}