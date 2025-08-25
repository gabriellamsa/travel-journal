"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Menu, X } from "lucide-react";

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
  avatar_url?: string;
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
            user_metadata: session.user.user_metadata,
            avatar_url: session.user.user_metadata?.avatar_url,
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
          user_metadata: session.user.user_metadata,
          avatar_url: session.user.user_metadata?.avatar_url,
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
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 no-underline text-gray-900"
          >
            <span className="font-bold tracking-tight text-xl">
              Travel Journal
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <Link
            href="/"
            className={`no-underline transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
              isActive("/")
                ? "font-semibold text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`no-underline transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
              isActive("/about")
                ? "font-semibold text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            About
          </Link>
          <Link
            href="/demo/create-trip"
            className="rounded-xl bg-blue-400 px-6 py-2 font-semibold text-white no-underline transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:scale-105"
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
                className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100 hover:scale-105"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

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
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white py-2 shadow-xl ring-1 ring-blue-100">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
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
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100 hover:scale-105"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-blue-400 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:scale-105"
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
          className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 p-2 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 md:hidden"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-blue-100 px-4 sm:px-6 lg:px-8 pb-4 pt-3 md:hidden bg-white/75 backdrop-blur-md"
          aria-label="Mobile"
        >
          <Link
            href="/"
            className={`py-2 no-underline transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
              isActive("/")
                ? "font-semibold text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`py-2 no-underline transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
              isActive("/about")
                ? "font-semibold text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/demo/create-trip"
            className="mt-1 inline-block w-fit rounded-xl bg-blue-400 px-6 py-2 font-semibold text-white no-underline transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Trip
          </Link>

          {/* mobile auth buttons */}
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-600 px-2 py-1 flex items-center gap-2">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Profile avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  Hello,{" "}
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </div>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-blue-400 px-4 py-2 text-center text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-lg"
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
