'use client';
import React from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";
import { LocaleSwitcher } from "lingo.dev/react/client";
import { useSession } from '@/lib/auth-client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
const LoginModal = dynamic(() => import('@/components/LoginModal'), { ssr: false });
function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: session } = useSession();

      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail(null);
      }
    };

    getSession();

    // Optional: listen for login changes via custom events if needed
    const onLogin = () => getSession();
    window.addEventListener("auth-logged-in", onLogin);
    window.addEventListener("auth-logged-out", onLogin);

    return () => {
      window.removeEventListener("auth-logged-in", onLogin);
      window.removeEventListener("auth-logged-out", onLogin);
    };
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setUserEmail(null);
    window.dispatchEvent(new Event("auth-logged-out")); // optional for cross-component updates
    router.refresh(); // or router.replace("/") if needed
  };

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <div className="pill-navbar px-8 py-4 flex items-center justify-center gap-8">
        <NavLink href="/" label="Home" />
        <NavLink href="#features" label="Features" />
        <NavLink href="#about" label="About" />

        {userEmail ? (
          <div className="flex items-center gap-3">
            <span className="text-white/90 text-sm">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="nav-link text-white/90 hover:text-white px-6 py-3 rounded-full transition-all duration-300 hover:bg-white/15 font-medium text-lg cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("show-login"))}
            className="nav-link text-white/90 hover:text-white px-6 py-3 rounded-full transition-all duration-300 hover:bg-white/15 font-medium text-lg cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      className="nav-link text-white/90 hover:text-white px-6 py-3 rounded-full transition-all duration-300 hover:bg-white/15 font-medium text-lg"
    >
      {label}
    </a>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Migrator - Transfer Your Music Library</title>
        <meta name="description" content="Seamlessly transfer your Spotify playlists, liked songs, and albums between accounts" />
      </head>
      <body className="min-h-screen gradient-bg">
          <div className="fixed top-4 left-4 z-50 your-locale-switcher">
  <LocaleSwitcher 
    locales={["en", "es", "zh", "ja", "fr", "de", "ru", "ar", "ko","tr"]}
    className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-black/40 bg-primary-gradient backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg"
  />
</div>
        <div className="bg-elements">
         
              <div className="floating-shape shape-1"></div>
              <div className="floating-shape shape-2"></div>
              <div className="floating-shape shape-3"></div>
              <div className="floating-shape shape-4"></div>
        </div>
          <Navbar />
          <LoginModal/>
          <main className="container mx-auto px-4 py-32 max-w-7xl fade-in-up">
            {children}
          </main>
          <footer className="w-full mt-20 py-8 border-t border-white/10">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="glass-card p-8 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-white/80">Made with</span>
                    <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white/80">by developers, for music lovers</span>
                  </div>
                  <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                    <span>© 2025 Spotify Migrator</span>
                    <span>•</span>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <span>•</span>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <span>•</span>
                    <a href="#" className="hover:text-white transition-colors">Support</a>
                  </div>
                </div>
              </div>
          </footer>
          <Toaster 
            position="top-center" 
              richColors 
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                },
              }}
            />
        </body>
    </html>
    </LingoProvider>
  );
}