import { useState, useEffect } from 'react';
import { Profile, ProfileUpdate } from '../types';
import { getProfile, updateProfile, createProfile } from '../profiles';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userProfile = await getProfile(userId);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          // create default profile if none exists
          const defaultProfile = await createProfile(userId, {
            full_name: '',
            bio: '',
            avatar_url: '',
          });
          if (defaultProfile) {
            setProfile(defaultProfile);
          }
        }
      } catch (err) {
        setError('Failed to fetch profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfileData = async (updates: ProfileUpdate): Promise<boolean> => {
    if (!userId || !profile) return false;

    try {
      setError(null);
      const updatedProfile = await updateProfile(userId, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
      return false;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile: updateProfileData,
    refetch: () => {
      if (userId) {
        setLoading(true);
        getProfile(userId).then(setProfile).finally(() => setLoading(false));
      }
    }
  };
}
