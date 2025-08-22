"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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

        {/* auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
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
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
          className="group relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 p-2 transition-all duration-200 hover:border-black/20 hover:bg-white/50 md:hidden"
        >
          <div className="flex h-5 w-5 flex-col items-center justify-center">
            <span
              className={`block h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${
                isMenuOpen ? "translate-y-1.5 rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${
                isMenuOpen ? "-translate-y-1.5 -rotate-45" : "translate-y-1"
              }`}
            />
          </div>
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
          </div>
        </nav>
      )}
    </header>
  );
}
