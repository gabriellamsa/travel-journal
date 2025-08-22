"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";
import { useProfile } from "@/lib/hooks/useProfile";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";
import ProfileDisplay from "@/components/profile/ProfileDisplay";
import ProfileEdit from "@/components/profile/ProfileEdit";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { profile, updateProfile } = useProfile(user?.id);

  useEffect(() => {
    // check if user is authenticated
    const checkUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.push("/login");
          return;
        }

        const userData = {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at,
        };

        setUser(userData);
      } catch (error) {
        console.error("Error checking user session:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Loading dashboard...</h2>
              <p className="text-gray-600">Please wait a moment</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome to your Travel Journal,{" "}
              {profile?.full_name || user?.email}
            </p>
          </div>

          {/* profile section */}
          {profile && (
            <div className="mb-8">
              {isEditingProfile ? (
                <ProfileEdit
                  profile={profile}
                  onProfileUpdate={async (updatedProfile) => {
                    await updateProfile({
                      full_name: updatedProfile.full_name || undefined,
                      bio: updatedProfile.bio || undefined,
                      avatar_url: updatedProfile.avatar_url || undefined,
                    });
                    setIsEditingProfile(false);
                  }}
                  onCancel={() => setIsEditingProfile(false)}
                />
              ) : (
                <ProfileDisplay
                  profile={profile}
                  onEdit={() => setIsEditingProfile(true)}
                />
              )}
            </div>
          )}

          {/* quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create New Trip
              </h3>
              <p className="text-gray-600 mb-4">
                Start documenting your next adventure
              </p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Create Trip
              </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Trips
              </h3>
              <p className="text-gray-600 mb-4">
                View and edit your existing trips
              </p>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                View Trips
              </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interactive Map
              </h3>
              <p className="text-gray-600 mb-4">
                Explore your trips on the map
              </p>
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                Open Map
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
