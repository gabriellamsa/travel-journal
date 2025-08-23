"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import PublicProfile from "@/components/profile/PublicProfile";
import { Trip, Memory, MapPin } from "@/components/profile/types";
import { getProfile } from "@/lib/profiles";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Empty arrays for real data (will be populated when we implement trips and memories)
const userTrips: Trip[] = [];
const userMemories: Memory[] = [];
const userMapPins: MapPin[] = [];

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      trips={userTrips}
      memories={userMemories}
      mapPins={userMapPins}
    />
  );
}
