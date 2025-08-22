"use client";

import { Profile } from "@/lib/types";

interface ProfileDisplayProps {
  profile: Profile;
  onEdit: () => void;
}

export default function ProfileDisplay({
  profile,
  onEdit,
}: ProfileDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Profile Information
        </h3>
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="space-y-4">
        {/* avatar */}
        {profile.avatar_url ? (
          <div className="flex items-center space-x-3">
            <img
              src={profile.avatar_url}
              alt="Profile avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div>
              <p className="text-sm text-gray-500"></p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-2xl">👤</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">No profile picture</p>
            </div>
          </div>
        )}

        {/* full name */}
        <div>
          <span className="font-medium text-gray-700"></span>
          <span className="mt-1 text-gray-900">
            {profile.full_name || "Not set"}
          </span>
        </div>

        {/* bio */}
        <div>
          <span className="font-medium text-gray-700">Bio:</span>
          <p className="mt-1 text-gray-900">
            {profile.bio || "No bio added yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
