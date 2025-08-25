import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/contexts/ProfileContext";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Journal",
  description: "Interactive travel journal to record and share memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased text-gray-900`}>
        <div className="min-h-screen flex flex-col relative">
          {/* Global gradient background */}
          <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50 via-indigo-50 via-slate-100 to-gray-100 pointer-events-none"></div>

          <ProfileProvider>
            <main className="flex-1 relative z-10">{children}</main>
          </ProfileProvider>
        </div>
      </body>
    </html>
  );
}
