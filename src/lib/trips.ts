import { createClient } from "@supabase/supabase-js";
import { Trip, TripCreate, TripUpdate, TripEntry, TripEntryCreate } from "./types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Trip functions
export async function createTrip(tripData: TripCreate): Promise<Trip> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("trips")
    .insert({
      title: tripData.title,
      description: tripData.description ?? null,
      destination: tripData.destination,
      start_date: tripData.start_date,
      end_date: tripData.end_date,
      is_public: true, // Always public by default
      cover_image_url: tripData.cover_image_url ?? null,
      status: tripData.status || "completed",
      tags: tripData.tags ?? null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Trip;
}

export async function getTrip(tripId: string): Promise<Trip | null> {
  try {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching trip:", error);
    return null;
  }
}

export async function getUserTrips(userId?: string): Promise<Trip[]> {
  try {
    let query = supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user trips:", error);
    return [];
  }
}

export async function updateTrip(tripId: string, updates: TripUpdate): Promise<Trip | null> {
  try {
    const { data, error } = await supabase
      .from("trips")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tripId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating trip:", error);
    return null;
  }
}

export async function deleteTrip(tripId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting trip:", error);
    return false;
  }
}

// Trip Entry functions
export async function createTripEntry(tripId: string, entryData: TripEntryCreate): Promise<TripEntry | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("trip_entries")
      .insert({
        ...entryData,
        trip_id: tripId,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating trip entry:", error);
    return null;
  }
}

export async function getTripEntry(entryId: string): Promise<TripEntry | null> {
  try {
    const { data, error } = await supabase
      .from("trip_entries")
      .select("*")
      .eq("id", entryId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching trip entry:", error);
    return null;
  }
}

export async function getTripEntries(tripId: string): Promise<TripEntry[]> {
  try {
    const { data, error } = await supabase
      .from("trip_entries")
      .select("*")
      .eq("trip_id", tripId)
      .order("entry_date", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching trip entries:", error);
    return [];
  }
}

export async function updateTripEntry(entryId: string, updates: Partial<TripEntryCreate>): Promise<TripEntry | null> {
  try {
    const { data, error } = await supabase
      .from("trip_entries")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating trip entry:", error);
    return null;
  }
}

export async function deleteTripEntry(entryId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("trip_entries")
      .delete()
      .eq("id", entryId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting trip entry:", error);
    return false;
  }
}

// Dashboard statistics functions
export async function getUserTripCount(userId?: string): Promise<number> {
  try {
    let query = supabase
      .from("trips")
      .select("id", { count: "exact" });

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      query = query.eq("user_id", user.id);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching trip count:", error);
    return 0;
  }
}

export async function getUserMemoryCount(userId?: string): Promise<number> {
  try {
    let query = supabase
      .from("trip_entries")
      .select("id", { count: "exact" });

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      query = query.eq("user_id", user.id);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching memory count:", error);
    return 0;
  }
}

export async function getRecentMemories(userId?: string, limit: number = 3): Promise<TripEntry[]> {
  try {
    let query = supabase
      .from("trip_entries")
      .select(`
        *,
        trips!inner(
          id,
          title,
          destination
        )
      `)
      .order("entry_date", { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching recent memories:", error);
    return [];
  }
}
