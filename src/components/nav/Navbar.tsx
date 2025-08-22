"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
            className={`text-foreground/90 no-underline transition-all duration-200 hover:font-semibold hover:brightness-110 ${
              pathname === "/" ? "font-semibold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-foreground/90 no-underline transition-all duration-200 hover:font-semibold hover:brightness-110 ${
              pathname === "/about" ? "font-semibold" : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/trips"
            className={`text-foreground/90 no-underline transition-all duration-200 hover:font-semibold hover:brightness-110 ${
              pathname === "/trips" ? "font-semibold" : ""
            }`}
          >
            Trips
          </Link>
          <Link
            href="/create"
            className="rounded-lg bg-foreground px-3 py-2 font-semibold text-background no-underline transition-all duration-200 hover:brightness-110"
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
            className="py-2 no-underline text-foreground transition-all duration-200 hover:font-semibold hover:brightness-110"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="py-2 no-underline text-foreground transition-all duration-200 hover:font-semibold hover:brightness-110"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/trips"
            className="py-2 no-underline text-foreground transition-all duration-200 hover:font-semibold hover:brightness-110"
            onClick={() => setIsMenuOpen(false)}
          >
            Trips
          </Link>
          <Link
            href="/create"
            className="mt-1 inline-block w-fit rounded-lg bg-foreground px-3 py-2 font-semibold text-background no-underline transition-all duration-200 hover:brightness-110"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Trip
          </Link>
        </nav>
      )}
    </header>
  );
}
