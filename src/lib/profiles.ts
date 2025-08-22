import { supabase } from './supabase';
import { Profile, ProfileUpdate } from './types';

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function createProfile(userId: string, profileData: ProfileUpdate): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, profileData: ProfileUpdate): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

export async function upsertProfile(userId: string, profileData: ProfileUpdate): Promise<Profile | null> {
  try {
    // first, try to fetch the existing profile
    const existingProfile = await getProfile(userId);
    
    if (existingProfile) {
      // if it exists, update it
      return await updateProfile(userId, profileData);
    } else {
      // if it doesn't exist, create it
      return await createProfile(userId, profileData);
    }
  } catch (error) {
    console.error('Error upserting profile:', error);
    return null;
  }
}
