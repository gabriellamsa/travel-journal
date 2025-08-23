"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Profile } from "@/lib/types";

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  const refreshProfile = () => {
    // This will trigger a re-fetch of the profile
    setProfile(null);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
