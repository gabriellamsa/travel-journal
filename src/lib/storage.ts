import { supabase } from './supabase';

export const AVATAR_BUCKET = 'avatars';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadAvatarImage(
  userId: string,
  file: File
): Promise<UploadResult> {
  try {
    // validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      };
    }

    // validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    // create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // upload to supabase storage
    const { data, error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // get public url
    const { data: { publicUrl } } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

export async function deleteAvatarImage(userId: string, fileName: string): Promise<boolean> {
  try {
    const filePath = `${userId}/${fileName}`;
    
    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete error:', err);
    return false;
  }
}
