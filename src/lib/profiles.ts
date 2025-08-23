import { supabase } from './supabase';
import { Profile, ProfileUpdate } from './types';

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    console.log('Fetching profile for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Supabase error fetching profile:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    if (!data) {
      console.log('No profile found for user:', userId);
      return null;
    }

    console.log('Profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

export async function createProfile(userId: string, profileData: ProfileUpdate): Promise<Profile | null> {
  try {
    console.log('Creating profile for user:', userId, 'with data:', profileData);
    
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
      console.error('Supabase error creating profile:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    console.log('Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, profileData: ProfileUpdate): Promise<Profile | null> {
  try {
    console.log('Updating profile for user:', userId, 'with data:', profileData);
    
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
      console.error('Supabase error updating profile:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    console.log('Profile updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return null;
  }
}

export async function upsertProfile(userId: string, profileData: ProfileUpdate): Promise<Profile | null> {
  try {
    console.log('Upserting profile for user:', userId, 'with data:', profileData);
    
    // first, try to fetch the existing profile
    const existingProfile = await getProfile(userId);
    
    if (existingProfile) {
      console.log('Profile exists, updating...');
      // if it exists, update it
      return await updateProfile(userId, profileData);
    } else {
      console.log('Profile does not exist, creating...');
      // if it doesn't exist, create it
      return await createProfile(userId, profileData);
    }
  } catch (error) {
    console.error('Unexpected error upserting profile:', error);
    return null;
  }
}
