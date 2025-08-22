"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            className="text-foreground/90 no-underline hover:opacity-100 opacity-90 transition-opacity"
          >
            Home
          </Link>
          <Link
            href="/trips"
            className="text-foreground/90 no-underline hover:opacity-100 opacity-90 transition-opacity"
          >
            Trips
          </Link>
          <Link
            href="/create"
            className="rounded-lg bg-foreground px-3 py-2 font-semibold text-background no-underline"
          >
            Create Trip
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
          className="inline-flex flex-col gap-1.5 rounded-lg border border-black/10 p-2 md:hidden"
        >
          <span className="block h-0.5 w-4 rounded bg-foreground" />
          <span className="block h-0.5 w-4 rounded bg-foreground" />
          <span className="block h-0.5 w-4 rounded bg-foreground" />
        </button>
      </div>

      {isMenuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-black/10 px-5 pb-4 pt-3 md:hidden"
          aria-label="Mobile"
        >
          <Link
            href="/"
            className="py-2 no-underline text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/trips"
            className="py-2 no-underline text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Trips
          </Link>
          <Link
            href="/create"
            className="mt-1 inline-block w-fit rounded-lg bg-foreground px-3 py-2 font-semibold text-background no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Trip
          </Link>
        </nav>
      )}
    </header>
  );
}
