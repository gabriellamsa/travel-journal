export interface Profile {
  id: string;
  created_at: string;
  updated_at: string | null;
  "display-name": string | null;
  avatar_url: string | null;
  bio: string | null;
  username: string | null;
  location: string | null;
  x: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
}

export interface ProfileUpdate {
  "display-name"?: string;
  avatar_url?: string;
  bio?: string;
  username?: string;
  location?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  profile?: Profile;
}

// Trip related types
export interface Trip {
  id: string;
  created_at: string;
  updated_at: string | null;
  user_id: string;
  title: string;
  description: string | null;
  destination: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  cover_image_url: string | null;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  tags: string[] | null;
  budget: number | null;
  currency: string | null;
}

export interface TripCreate {
  title: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  cover_image_url?: string;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
  tags?: string[];
  budget?: number;
  currency?: string;
}

export interface TripUpdate {
  title?: string;
  description?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  cover_image_url?: string;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
  tags?: string[];
  budget?: number;
  currency?: string;
}

export interface TripEntry {
  id: string;
  created_at: string;
  updated_at: string | null;
  trip_id: string;
  user_id: string;
  title: string;
  content: string | null;
  location: string | null;
  entry_date: string;
  image_urls: string[] | null;
  tags: string[] | null;
}

export interface TripEntryCreate {
  title: string;
  content?: string;
  location?: string;
  entry_date: string;
  image_urls?: string[];
  tags?: string[];
}
