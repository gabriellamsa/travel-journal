"use client";

import { useState, useRef } from "react";
import { Profile, ProfileUpdate } from "@/lib/types";
import { updateProfile } from "@/lib/profiles";
import { uploadAvatarImage } from "@/lib/storage";

interface ProfileEditProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
  onCancel: () => void;
}

export default function ProfileEdit({
  profile,
  onProfileUpdate,
  onCancel,
}: ProfileEditProps) {
  const [formData, setFormData] = useState<ProfileUpdate>({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    avatar_url: profile.avatar_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile.avatar_url
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // check if there's a new file to upload
      const fileInput = fileInputRef.current;
      let avatarUrl = formData.avatar_url;

      if (fileInput?.files?.[0]) {
        setUploading(true);
        const file = fileInput.files[0];
        const result = await uploadAvatarImage(profile.id, file);
        setUploading(false);

        if (result.success && result.url) {
          avatarUrl = result.url;
        } else {
          setError(result.error || "Failed to upload avatar image");
          setLoading(false);
          return;
        }
      }

      // update profile with new avatar url
      const updatedProfile = await updateProfile(profile.id, {
        ...formData,
        avatar_url: avatarUrl,
      });

      if (updatedProfile) {
        onProfileUpdate(updatedProfile);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileUpdate, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // create preview url
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // store file for upload
      setFormData((prev) => ({
        ...prev,
        avatar_url: file.name, // temporary name for now
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* avatar upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>

          {/* current avatar preview */}
          {previewUrl && (
            <div className="mb-3">
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          )}

          {/* file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={uploading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPG, PNG, GIF. Max size: 5MB
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Saving..."
              : uploading
              ? "Uploading..."
              : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
