"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Menu, X } from "lucide-react";

interface User {
  id: string;
  email: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    // check if user is authenticated
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
          });
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // listen for authentication changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsProfileOpen(false);
      // Redirect to home page after sign out
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 no-underline text-foreground"
          >
            <span className="font-bold tracking-tight">Travel Journal</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-4 md:flex" aria-label="Primary">
          <Link
            href="/"
            className={`no-underline transition-all duration-200 hover:text-foreground hover:scale-105 ${
              isActive("/")
                ? "font-bold text-foreground"
                : "text-foreground/70 hover:text-foreground/90"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`no-underline transition-all duration-200 hover:text-foreground hover:scale-105 ${
              isActive("/about")
                ? "font-bold text-foreground"
                : "text-foreground/70 hover:text-foreground/90"
            }`}
          >
            About
          </Link>
          <Link
            href="/trips"
            className={`no-underline transition-all duration-200 hover:text-foreground hover:scale-105 ${
              isActive("/trips")
                ? "font-bold text-foreground"
                : "text-foreground/70 hover:text-foreground/90"
            }`}
          >
            Trips
          </Link>
          <Link
            href="/create"
            className="rounded-lg bg-foreground px-3 py-2 font-semibold text-background no-underline transition-all duration-200 hover:bg-foreground/90 hover:scale-105"
          >
            Create Trip
          </Link>
        </nav>

        {/* auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <span>{user.email}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* profile dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                Create Free Account
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
          className="group relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 p-2 transition-all duration-200 hover:border-black/20 hover:bg-white/50 md:hidden"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-black/10 px-5 pb-4 pt-3 md:hidden"
          aria-label="Mobile"
        >
          <Link
            href="/"
            className={`py-2 no-underline transition-all duration-200 hover:text-foreground hover:scale-105 ${
              isActive("/")
                ? "font-bold text-foreground"
                : "text-foreground/70 hover:text-foreground/90"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`py-2 no-underline transition-all duration-200 hover:text-foreground hover:scale-105 ${
              isActive("/about")
                ? "font-bold text-foreground"
                : "text-foreground/70 hover:text-foreground/90"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/trips"
            className={`py-2 no-underline transition-all duration-200 hover:text-foreground hover:scale-105 ${
              isActive("/trips")
                ? "font-bold text-foreground"
                : "text-foreground/70 hover:text-foreground/90"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Trips
          </Link>
          <Link
            href="/create"
            className="mt-1 inline-block w-fit rounded-lg bg-foreground px-3 py-2 font-semibold text-background no-underline transition-all duration-200 hover:bg-foreground/90 hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Trip
          </Link>

          {/* mobile auth buttons */}
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-600 px-2 py-1">
                  Hello, {user.email}
                </div>
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gray-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
