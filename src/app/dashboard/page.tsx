"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  MapPin,
  Heart,
  Plus,
  Calendar,
  Users,
  MapPin as MapPinIcon,
} from "lucide-react";
import {
  getUserTripCount,
  getUserMemoryCount,
  getRecentMemories,
} from "@/lib/trips";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [tripCount, setTripCount] = useState(0);
  const [memoryCount, setMemoryCount] = useState(0);
  const [recentMemories, setRecentMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadStatistics = async (userId: string) => {
    try {
      const [trips, memories, recent] = await Promise.all([
        getUserTripCount(userId),
        getUserMemoryCount(userId),
        getRecentMemories(userId, 3),
      ]);
      setTripCount(trips);
      setMemoryCount(memories);
      setRecentMemories(recent);
    } catch (error) {
      console.error("Error loading dashboard statistics:", error);
    } finally {
      setLoading(false);
    }
  };

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
      await loadStatistics(session.user.id);
    };

    checkUser();
  }, [router]);

  // Listen for trip and memory updates to refresh statistics
  useEffect(() => {
    const handleTripUpdate = () => {
      if (user?.id) {
        loadStatistics(user.id);
      }
    };

    const handleMemoryUpdate = () => {
      if (user?.id) {
        loadStatistics(user.id);
      }
    };

    window.addEventListener("tripUpdated", handleTripUpdate);
    window.addEventListener("memoryUpdated", handleMemoryUpdate);

    return () => {
      window.removeEventListener("tripUpdated", handleTripUpdate);
      window.removeEventListener("memoryUpdated", handleMemoryUpdate);
    };
  }, [user]);

  return (
    <DashboardLayout
      title="Welcome back!"
      subtitle="Here's what's happening with your travel memories"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : tripCount}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Travel Memories
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : memoryCount}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Friends</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Memories
          </h2>
          <p className="text-gray-600 mt-1">
            Your latest travel memories and experiences
          </p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading memories...</p>
            </div>
          ) : recentMemories.length > 0 ? (
            <div className="space-y-4">
              {recentMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/trips/${memory.trip_id}`)
                  }
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {memory.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {memory.trips?.destination || "Unknown destination"}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        {memory.location || "No location"}
                      </span>
                      <span>
                        {new Date(memory.entry_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/trips/${memory.trip_id}`);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <button
                  onClick={() => router.push("/dashboard/trips")}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span>View all memories</span>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No memories yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your travel journal to start documenting your adventures
              </p>
              <button
                onClick={() => router.push("/dashboard/create-trip")}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
