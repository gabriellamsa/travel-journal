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
