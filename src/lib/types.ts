export interface Profile {
  id: string;
  created_at: string;
  updated_at: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface ProfileUpdate {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  profile?: Profile;
}
