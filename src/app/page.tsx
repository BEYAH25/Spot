// import { AuroraText } from "@/components/magicui/aurora-text";
// import ResendEmailForm from "@/components/resend/form";
// import BetterAuth from "@/components/better-auth";
// import Autumn from "@/components/autumn";
// import { headers } from "next/headers";
// import { auth } from "@/lib/auth";

// export default async function Home() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   const userEmail = session?.user?.email;

//   return (
//     <>
//       <h1 className="text-4xl font-bold text-center">
//         Welcome to{" "}
//         <AuroraText colors={["#6600ff", "#69e300", "#80ffce"]}>
//           CustomHack train
//         </AuroraText>
//       </h1>
//       <BetterAuth userEmail={userEmail} />
//       <Autumn />
//       {/* <Tambo /> */}
//       <ResendEmailForm />
//       {/* <Firecrawl /> */}
//     </>
//   );
// }
'use client';
import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth-client';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const { data: session } = useSession();

  React.useEffect(() => {
    const handleShowLogin = () => setShowLogin(true);
    window.addEventListener('show-login', handleShowLogin);
    return () => window.removeEventListener('show-login', handleShowLogin);
  }, []);

  function Hero() {
    return (
      <section className="text-center mb-24 fade-in-up">
        <div className="relative">
          {/* Hero Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10"></div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {/* <div className="heart"></div> */}
               <span className="text-xs font-medium text-white/80">Now supporting all Spotify features</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gradient mb-6 leading-tight">
              Migrator
              <br />
              <span className="text-gradient-secondary"></span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Seamlessly transfer your entire music library between Spotify accounts. 
              <span className="text-gradient-secondary font-semibold"> Playlists, liked songs, albums</span> - 
              everything moves with you.
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            And the best part? It's completely free and open-source. </p>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">Additionally, you have an AI that analyses 
            your genres and suggests new music according to that!!
             Ain't that cool ? 
             </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/migrate" 
                className="btn-primary text-base px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all group"
              >
                <span className="flex items-center gap-2">
                  Start Migration
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-gradient mb-1">100%</div>
                <div className="text-white/70 text-sm">Success Rate</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-gradient mb-1">2K</div>
                <div className="text-white/70 text-sm">Songs Migrated</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-gradient mb-1">1</div>
                <div className="text-white/70 text-sm">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function FeatureCard({ icon, title, description, delay = 1 }: { 
    icon: string; 
    title: string; 
    description: string; 
    delay?: number;
  }) {
    return (
      <div 
        className="display-flex glass-card p-6 text-center group hover:scale-105 transition-all duration-500"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-all">
          {title}
        </h3>
        <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors text-sm">
          {description}
        </p>
      </div>
    );
  }

  function LoginModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      
      try {
        await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onResponse: () => {
              setLoading(false);
            },
            onRequest: () => {
              setError('');
              setLoading(true);
            },
            onSuccess: () => {
              setShowLogin(false);
              router.refresh();
            },
            onError: (ctx) => {
              setError(ctx.error.message);
            },
          }
        );
      } catch (err: any) {
        setError(err.message || 'An error occurred during login');
      } finally {
        setLoading(false);
      }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target === e.currentTarget) {
        setShowLogin(false);
      }
    };

    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300"
        style={{ 
          background: 'rgba(0, 0, 0, 0.5)', 
          backdropFilter: 'blur(20px)' 
        }}
        onClick={handleOverlayClick}
      >
        <div className="glass-card w-full max-w-sm mx-4 p-6 scale-in">
          <button 
            className="absolute top-4 right-4 text-white/60 hover:text-white text-xl p-1 rounded-full hover:bg-white/10 transition-all hover:rotate-90"
            onClick={() => setShowLogin(false)}
          >
            ×
          </button>
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gradient mb-2">Welcome Back</h2>
            <p className="text-white/70 text-sm">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label text-sm" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input text-sm py-2.5"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="form-label text-sm" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input text-sm py-2.5"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
            
            {error && (
              <div className="text-red-400 text-center text-xs bg-red-400/10 border border-red-400/20 rounded-lg p-2">
                {error}
              </div>
            )}
          </form>
          
          <div className="text-center mt-4">
            <a 
              href="#" 
              className="text-white/60 hover:text-white text-xs transition-colors"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Suspense>
      <main className="min-h-screen w-full">
      <Hero />
      {/* Features Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Powerful features designed to make your music migration seamless and secure
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon="🎵" 
            title="Migrate Playlists" 
            description="Transfer all your carefully curated playlists with their exact order and metadata preserved."
            delay={0}
          />
          <FeatureCard 
            icon="❤️" 
            title="Liked Songs" 
            description="Move your entire liked songs collection without losing any of your favorite tracks."
            delay={100}
          />
          <FeatureCard 
            icon="💿" 
            title="Saved Albums" 
            description="Keep your saved albums collection intact when switching between accounts."
            delay={200}
          />
          <FeatureCard 
            icon="🔒" 
            title="Secure & Private" 
            description="OAuth2 authentication ensures your data stays safe. We never store your credentials."
            delay={300}
          />
          <FeatureCard 
            icon="⚡" 
            title="Lightning Fast" 
            description="Optimized migration process transfers thousands of songs in minutes, not hours."
            delay={400}
          />
          <FeatureCard 
            icon="🎯" 
            title="100% Accurate" 
            description="Advanced matching algorithms ensure every song, playlist, and album transfers correctly."
            delay={500}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            How It Works
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Simple 3-step process to migrate your entire music library
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card overflow-visible p-6 text-center flex relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-bold text-white mb-3">Connect Accounts</h3>
            <p className="text-white/70 text-sm">Securely connect both your source and destination Spotify accounts</p>
          </div>
          
          <div className="glass-card p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-white mb-3">Select Content</h3>
            <p className="text-white/70 text-sm">Choose which playlists, liked songs, and albums you want to migrate</p>
          </div>
          
          <div className="glass-card p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-bold text-white mb-3">Start Migration</h3>
            <p className="text-white/70 text-sm">Sit back and watch as your music library transfers automatically</p>
          </div>
        </div>
      </section>
      {showLogin && <LoginModal />}
    </main>
    </Suspense>
  );
}