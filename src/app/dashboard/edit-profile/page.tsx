"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Camera } from "lucide-react";
import { getProfile, upsertProfile } from "@/lib/profiles";
import { Profile } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({
    id: "",
    "display-name": "",
    bio: "",
    avatar_url: "",
    username: "",
    location: "",
    instagram: "",
    x: "",
    facebook: "",
    website: "",
    created_at: "",
    updated_at: "",
  });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      // Load existing profile data
      const existingProfile = await getProfile(session.user.id);
      if (existingProfile) {
        console.log("Profile loaded successfully:", existingProfile);
        setProfile(existingProfile);
        if (existingProfile.avatar_url) {
          setPreviewUrl(existingProfile.avatar_url);
        }
      } else {
        console.log("No existing profile found, initializing with user data");
        // Initialize with user data
        setProfile((prev) => ({
          ...prev,
          id: session.user.id,
          "display-name": session.user.user_metadata?.full_name || "",
          username: session.user.email?.split("@")[0] || "",
        }));
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleInputChange = (
    field: keyof Profile,
    value: string | string[]
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setError(null);

    try {
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      const updatedProfile = await upsertProfile(user.id, {
        avatar_url: publicUrl,
      });

      if (updatedProfile) {
        setProfile(updatedProfile);
        setSuccess("Avatar updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }

      // Clean up
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
      console.error("Error uploading avatar:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !profile.avatar_url) return;

    try {
      // Update profile to remove avatar
      const updatedProfile = await upsertProfile(user.id, {
        avatar_url: undefined,
      });

      if (updatedProfile) {
        setProfile(updatedProfile);
        setPreviewUrl(null);
        setSuccess("Avatar removed successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to remove avatar");
      console.error("Error removing avatar:", err);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Map the form fields to the Profile structure
      const profileData = {
        "display-name": profile["display-name"] || undefined,
        bio: profile.bio || undefined,
        username: profile.username || undefined,
        location: profile.location || undefined,
        instagram: profile.instagram || undefined,
        x: profile.x || undefined,
        facebook: profile.facebook || undefined,
        website: profile.website || undefined,
      };

      const updatedProfile = await upsertProfile(user.id, profileData);

      if (updatedProfile) {
        setProfile(updatedProfile);
        setSuccess("Profile updated successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating the profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Loading..."
        subtitle="Please wait while we load your profile"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Edit Profile"
      subtitle="Update your travel profile and personal information"
    >
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Top Header Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex items-start justify-between">
          {/* Left Side - User Identity */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-500" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.username || "Traveler"}
              </h1>
              <p className="text-gray-600">@{profile.username || "traveler"}</p>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex space-x-3">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Avatar upload button */}
            {selectedFile && (
              <button
                onClick={handleAvatarUpload}
                disabled={uploading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Avatar"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Profile Information
          </h2>
          <p className="text-gray-600 mt-1">
            Update your travel profile and personal information
          </p>
        </div>

        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={profile["display-name"] ?? ""}
                onChange={(e) =>
                  handleInputChange("display-name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={profile.username ?? ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={profile.location ?? ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Country etc."
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Bio
            </label>
            <textarea
              value={profile.bio ?? ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
              placeholder="Tell us about yourself, your travel experiences, and what inspires you to explore the world..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Share your story, travel adventures, and what inspires you to
              explore the world.
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Social Media Links
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add your social media profiles (optional)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X (Twitter)
                </label>
                <input
                  type="text"
                  value={profile.x ?? ""}
                  onChange={(e) => handleInputChange("x", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your X username (without @)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={profile.instagram ?? ""}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Instagram username (without @)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  value={profile.facebook ?? ""}
                  onChange={(e) =>
                    handleInputChange("facebook", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Facebook username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website ?? ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </DashboardLayout>
  );
}
