# Profile System - Travel Journal

This document explains how the profile system has been integrated into Travel Journal.

## Table Structure

The `profiles` table in Supabase contains the following columns:

- `id` (uuid, primary key) - User ID (reference to auth.users)
- `created_at` (timestamp) - Profile creation date
- `updated_at` (timestamp) - Last update date
- `full_name` (text) - User's full name
- `avatar_url` (text) - Profile image URL
- `bio` (text) - User biography

## Files Created/Modified

### 1. TypeScript Types (`src/lib/types.ts`)

- `Profile` - Interface for complete profile
- `ProfileUpdate` - Interface for partial updates
- `User` - Updated interface including profile

### 2. Profile Functions (`src/lib/profiles.ts`)

- `getProfile(userId)` - Fetch profile by ID
- `createProfile(userId, data)` - Create new profile
- `updateProfile(userId, data)` - Update existing profile
- `upsertProfile(userId, data)` - Create or update profile

### 3. Custom Hook (`src/lib/hooks/useProfile.ts`)

- `useProfile(userId)` - Hook to manage profile state
- Manages loading, error and updates automatically

### 4. Profile Components

- `ProfileDisplay` - Displays profile information
- `ProfileEdit` - Form to edit profile

### 5. Updated Dashboard

- Integrates profile system
- Allows inline profile editing
- Shows profile information in greeting

## How to Use

### 1. Supabase Configuration

Execute the `supabase-policies.sql` file in your Supabase project to configure security policies.

### 2. Dashboard Usage

The dashboard now automatically:

- Fetches the logged-in user's profile
- Creates a default profile if none exists
- Allows inline profile editing

### 3. Usage in Other Components

```typescript
import { useProfile } from "@/lib/hooks/useProfile";

function MyComponent() {
  const { profile, loading, error, updateProfile } = useProfile(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Hello, {profile?.full_name || "User"}!</h1>
      <p>{profile?.bio || "No bio yet"}</p>
    </div>
  );
}
```

## Features

- ✅ Automatic profile creation on login
- ✅ Inline profile editing in dashboard
- ✅ Image upload for avatars (Supabase Storage)
- ✅ TypeScript type validation
- ✅ Supabase security policies
- ✅ Custom hook for state management

## Next Steps

1. **Form Validation**: Add form validation with libraries like Zod
2. **Caching**: Implement profile caching for better performance
3. **Notifications**: Add success/error notifications when updating profile
4. **Image Optimization**: Add image compression and resizing

## Security

- RLS (Row Level Security) enabled
- Users can only access their own profiles
- Authentication validation on all operations
