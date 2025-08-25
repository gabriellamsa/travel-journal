"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Globe, Calendar, Heart, Tag, Edit } from "lucide-react";
import { PublicProfileProps } from "./types";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";
import MemoryModal from "./MemoryModal";

const PublicProfile: React.FC<PublicProfileProps> = ({
  profile,
  trips,
  memories,
  mapPins,
}) => {
  const router = useRouter();
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localMemories, setLocalMemories] = useState(memories);

  const handleMemoryClick = (memory: any) => {
    setSelectedMemory(memory);
    setIsModalOpen(true);
  };

  const handleEditProfile = () => {
    router.push("/dashboard/edit-profile");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMemory(null);
  };

  const handleUpdateMemory = (updatedMemory: any) => {
    // Update the memory in the local state
    setLocalMemories((prev) =>
      prev.map((m) => (m.id === updatedMemory.id ? updatedMemory : m))
    );
  };

  // Listen for memory updates from other components
  useEffect(() => {
    const handleMemoryUpdate = (event: CustomEvent) => {
      const { memory } = event.detail;
      setLocalMemories((prev) =>
        prev.map((m) => (m.id === memory.id ? memory : m))
      );
    };

    window.addEventListener(
      "memoryUpdated",
      handleMemoryUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "memoryUpdated",
        handleMemoryUpdate as EventListener
      );
    };
  }, []);

  const palette = [
    {
      bg: "bg-blue-100",
      fg: "text-blue-800",
    },
    {
      bg: "bg-emerald-100",
      fg: "text-emerald-800",
    },
    {
      bg: "bg-purple-100",
      fg: "text-purple-800",
    },
    {
      bg: "bg-amber-100",
      fg: "text-amber-800",
    },
    {
      bg: "bg-rose-100",
      fg: "text-rose-800",
    },
    {
      bg: "bg-cyan-100",
      fg: "text-cyan-800",
    },
  ];

  const colorFor = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++)
      hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
    return palette[hash % palette.length];
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Profile Section */}
        <section className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8 sm:mb-12">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden">
              {profile.avatarUrl &&
              profile.avatarUrl !== "/about-founder.jpg" ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to default image if remote image fails
                    const target = e.target as HTMLImageElement;
                    target.src = "/about-founder.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-600">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                    {profile.name}
                  </h2>
                  <button
                    onClick={handleEditProfile}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Edit profile"
                  >
                    <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
                {profile.username && (
                  <p className="text-base sm:text-lg text-gray-600 mb-2">
                    @{profile.username}
                  </p>
                )}
                {profile.location && (
                  <p className="text-base sm:text-lg text-gray-600 mb-2 flex items-center justify-center sm:justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.location}
                  </p>
                )}
                <p className="text-base sm:text-lg text-black mb-4 flex items-center justify-center sm:justify-start">
                  {profile.description}
                  <Globe className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </p>
              </div>

              {/* Social Media Links */}
              {profile.socialMedia && (
                <div className="flex items-center justify-center sm:justify-start space-x-4">
                  {profile.socialMedia.x && (
                    <a
                      href={`https://x.com/${profile.socialMedia.x}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {profile.socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${profile.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-500 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {profile.socialMedia.facebook && (
                    <a
                      href={`https://facebook.com/${profile.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {profile.socialMedia.website && (
                    <a
                      href={profile.socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="mb-8 sm:mb-12">
          <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
            <div className="w-full h-64 sm:h-96 bg-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600 px-4">
                <MapPin className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-blue-400" />
                <p className="text-base sm:text-lg">No travel locations yet</p>
                <p className="text-sm mt-1">Your travel map will appear here</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trips Section */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-6">
            Trips
          </h3>
          {trips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {trips.map((trip) => (
                <a
                  key={trip.id}
                  href={`/dashboard/trips/${trip.id}`}
                  className="bg-white rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-200"
                >
                  <h4 className="text-lg sm:text-xl font-semibold text-black mb-3">
                    {trip.title}
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center text-sm sm:text-base">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {trip.locations.join(", ")}
                      </span>
                    </p>
                    <p className="flex items-center text-sm sm:text-base">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      {trip.dates}
                    </p>
                    {trip.tags && trip.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {trip.tags.map((tag, index) => {
                          const palette = [
                            { bg: "bg-blue-100", fg: "text-blue-800" },
                            { bg: "bg-emerald-100", fg: "text-emerald-800" },
                            { bg: "bg-purple-100", fg: "text-purple-800" },
                            { bg: "bg-amber-100", fg: "text-amber-800" },
                            { bg: "bg-rose-100", fg: "text-rose-800" },
                            { bg: "bg-cyan-100", fg: "text-cyan-800" },
                          ];
                          let hash = 0;
                          for (let i = 0; i < tag.length; i++)
                            hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
                          const color = palette[hash % palette.length];
                          return (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2 py-1 ${color.bg} ${color.fg} rounded-full text-xs`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">
                No trips planned yet
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Start planning your next adventure!
              </p>
            </div>
          )}
        </section>

        {/* Memories Section */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-6">
            Memories
          </h3>
          {localMemories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {localMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow shadow-sm cursor-pointer"
                  onClick={() => handleMemoryClick(memory)}
                >
                  <div className="relative h-40 sm:h-48">
                    {memory.imageUrl &&
                    memory.imageUrl !== "/about-founder.jpg" ? (
                      <Image
                        src={memory.imageUrl}
                        alt={memory.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to default image if remote image fails
                          const target = e.target as HTMLImageElement;
                          target.src = "/about-founder.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl sm:text-2xl">📸</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="font-semibold text-black mb-2 flex items-center text-sm sm:text-base">
                      <span className="truncate">{memory.title}</span>
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mb-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{memory.location}</span>
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm flex items-center">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      {memory.date}
                    </p>
                    {memory.tags && memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {memory.tags.slice(0, 3).map((tag, index) => {
                          const color = colorFor(tag);
                          return (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2 py-1 ${color.bg} ${color.fg} rounded-full text-xs`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                        {memory.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{memory.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">
                No memories shared yet
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Start documenting your travel experiences!
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Memory Modal */}
      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdateMemory}
        />
      )}

      <Footer />
    </div>
  );
};

export default PublicProfile;
