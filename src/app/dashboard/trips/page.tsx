"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getUserTrips } from "@/lib/trips";
import { Trip } from "@/lib/types";
import { MapPin, Calendar, Eye, EyeOff, Edit } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MyTripsPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      const data = await getUserTrips(session.user.id);
      setTrips(data || []);
      setLoading(false);
    };
    init();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout title="My Trips" subtitle="Your travel journals">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No trips yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first trip to see it here.
          </p>
          <button
            onClick={() => router.push("/dashboard/create-trip")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create a Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="text-left bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/trips/${trip.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg truncate">
                  {trip.title}
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/trips/${trip.id}/edit`);
                    }}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                    aria-label="Edit trip"
                    title="Edit trip"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {trip.is_public ? (
                    <span className="inline-flex items-center text-xs text-gray-600">
                      <Eye className="w-4 h-4 mr-1" /> Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs text-gray-600">
                      <EyeOff className="w-4 h-4 mr-1" /> Private
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1 text-gray-700">
                <p className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2" /> {trip.destination}
                </p>
                <p className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2" />{" "}
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </p>
              </div>
              {trip.tags && trip.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {trip.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
