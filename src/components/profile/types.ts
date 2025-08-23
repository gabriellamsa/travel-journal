export interface Trip {
  id: string;
  title: string;
  locations: string[];
  dates: string;
}

export interface Memory {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  emoji: string;
}

export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  location: string;
}

export interface Profile {
  name: string;
  description: string;
  avatarUrl: string;
  username?: string;
  location?: string;
  socialMedia?: {
    x?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

export interface PublicProfileProps {
  profile: Profile;
  trips: Trip[];
  memories: Memory[];
  mapPins: MapPin[];
}
