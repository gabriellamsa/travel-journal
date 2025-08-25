"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import PublicProfile from "@/components/profile/PublicProfile";
import { Trip, Memory, MapPin } from "@/components/profile/types";
import { getProfile } from "@/lib/profiles";
import { getUserTrips, getTripEntries } from "@/lib/trips";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Placeholder initial values
const emptyTrips: Trip[] = [];
const emptyMemories: Memory[] = [];
const emptyMapPins: MapPin[] = [];

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileTrips, setProfileTrips] = useState<Trip[]>(emptyTrips);
  const [profileMemories, setProfileMemories] =
    useState<Memory[]>(emptyMemories);
  const [profileMapPins] = useState<MapPin[]>(emptyMapPins);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      // Load user profile
      const profile = await getProfile(session.user.id);
      if (profile) {
        setUserProfile(profile);
      }

      // Load user's trips and memories
      try {
        const trips = await getUserTrips(session.user.id);
        // Map trips to PublicProfile Trip type
        const mappedTrips: Trip[] = (trips || [])
          .filter((t) => t.is_public)
          .map((t) => ({
            id: t.id,
            title: t.title,
            locations: [t.destination].filter(Boolean),
            dates: `${new Date(t.start_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })} - ${new Date(t.end_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`,
          }));
        setProfileTrips(mappedTrips);

        // Load entries for each trip and flatten
        const entriesArrays = await Promise.all(
          (trips || []).map((t) => getTripEntries(t.id))
        );
        const moodToEmoji: Record<string, string> = {
          excited: "😃",
          happy: "😊",
          neutral: "😐",
          sad: "😢",
          stressed: "😰",
        };
        const flattened = entriesArrays.flat();
        const mappedMemories: Memory[] = flattened.map((e) => ({
          id: e.id,
          title: e.title,
          location: e.location || "",
          date: new Date(e.entry_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          imageUrl:
            e.image_urls && e.image_urls.length > 0
              ? e.image_urls[0]
              : "/about-founder.jpg",
          emoji: e.mood ? moodToEmoji[e.mood] || "😊" : "😊",
        }));
        setProfileMemories(mappedMemories);
      } catch (err) {
        console.error("Error loading trips/memories for profile:", err);
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Transform user profile data to match our component interface
  const profileData = {
    name:
      userProfile?.["display-name"] ||
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "User",
    description: userProfile?.bio || "No bio available",
    avatarUrl: userProfile?.avatar_url || "/about-founder.jpg",
    username: userProfile?.username,
    location: userProfile?.location,
    socialMedia: {
      x: userProfile?.x,
      instagram: userProfile?.instagram,
      facebook: userProfile?.facebook,
      website: userProfile?.website,
    },
  };

  return (
    <PublicProfile
      profile={profileData}
      trips={profileTrips}
      memories={profileMemories}
      mapPins={profileMapPins}
    />
  );
}
