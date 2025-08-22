# Testing Profile Integration

## Prerequisites

1. ✅ `profiles` table created in Supabase
2. ✅ Security policies applied (execute `supabase-policies.sql`)
3. ✅ Project running locally (`npm run dev`)

## Testing Steps

### 1. Login and Profile Creation Test

1. Go to `/login` and login with an existing account
2. You will be redirected to `/dashboard`
3. Verify that a default profile was created automatically
4. The dashboard should show "Welcome to your Travel Journal, [email]"

### 2. Profile Editing Test

1. In the dashboard, click "Edit Profile"
2. Fill in the fields:
   - **Full Name**: Your full name
   - **Bio**: A brief description about yourself
   - **Profile Picture**: Upload an image file (JPG, PNG, GIF)
3. Click "Save Changes"
4. Verify that the information was saved
5. Click "Edit Profile" again to verify that the data persists

### 3. Persistence Test

1. Logout
2. Login again
3. Verify that the profile is still there with the edited information
4. The dashboard should show "Welcome to your Travel Journal, [your name]"

### 4. Supabase Verification

1. Access the Supabase dashboard
2. Go to Table Editor > profiles
3. Verify that there is a record with your user ID
4. Confirm that the `full_name`, `bio`, and `avatar_url` fields are filled
5. Verify that `created_at` and `updated_at` are being updated

## Error Scenarios to Test

### 1. Invalid Image File

- Try uploading a non-image file
- The component should show an error message
- Try uploading an image larger than 5MB
- The component should show a size limit error

### 2. Empty Fields

- Leave required fields empty
- Verify that the system handles null values well

### 3. Connectivity

- Test with slow or unstable connection
- Verify that loading states work

## Security Checks

### 1. Unauthorized Access

- Try to access other users' profiles
- Verify that RLS policies are working

### 2. Data Validation

- Try to insert malicious data
- Verify that the system sanitizes inputs

## Logs to Monitor

In the browser console, you should see:

- ✅ "Profile fetched successfully" when loading profile
- ✅ "Profile updated successfully" when saving changes
- ❌ No permission or unauthorized access errors

## Common Problems and Solutions

### Problem: Profile is not created automatically

**Solution**: Verify that INSERT policies are applied in Supabase

### Problem: Error updating profile

**Solution**: Verify that UPDATE policies are applied

### Problem: Avatar doesn't upload

**Solution**: Verify that the Supabase Storage bucket 'avatars' exists and policies are set

### Problem: Dashboard doesn't load

**Solution**: Verify that the `useProfile` hook is working correctly

## Next Tests

After confirming everything is working:

1. **Performance Test**: Verify there are no unnecessary multiple calls
2. **Responsiveness Test**: Test on different screen sizes
3. **Accessibility Test**: Verify that forms are accessible
4. **Validation Test**: Implement more robust form validation
