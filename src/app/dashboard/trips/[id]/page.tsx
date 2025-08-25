"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getTrip,
  getTripEntries,
  createTripEntry,
  deleteTripEntry,
  deleteTrip,
} from "@/lib/trips";
import { Trip, TripEntry, TripEntryCreate } from "@/lib/types";
import {
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Camera,
  X,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TripDetail() {
  const [user, setUser] = useState<any>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [entries, setEntries] = useState<TripEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingEntry, setCreatingEntry] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [newEntry, setNewEntry] = useState<TripEntryCreate>({
    title: "",
    content: "",
    location: "",
    entry_date: new Date().toISOString().split("T")[0],
    mood: "happy",
    weather: "",
    tags: [],
    image_urls: [],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

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
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const loadTripData = async () => {
      if (!tripId) return;

      try {
        const [tripData, entriesData] = await Promise.all([
          getTrip(tripId),
          getTripEntries(tripId),
        ]);

        if (tripData) {
          setTrip(tripData);
        } else {
          router.push("/dashboard");
          return;
        }

        setEntries(entriesData);
      } catch (error) {
        console.error("Error loading trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, [tripId, router]);

  const handleAddTag = () => {
    if (tagInput.trim() && !newEntry.tags?.includes(tagInput.trim())) {
      setNewEntry((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `trip-entries/${tripId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("trip-images")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(
          `Failed to upload ${file.name}: ${uploadError.message}`
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("trip-images").getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      alert("You can only upload up to 5 images per memory.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingEntry(true);
    setUploadingImages(true);

    try {
      let imageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages(selectedFiles);
      }

      const entry = await createTripEntry(tripId, {
        ...newEntry,
        image_urls: imageUrls,
      });

      if (entry) {
        setEntries((prev) => [entry, ...prev]);
        setNewEntry({
          title: "",
          content: "",
          location: "",
          entry_date: new Date().toISOString().split("T")[0],
          mood: "happy",
          weather: "",
          tags: [],
          image_urls: [],
        });
        setSelectedFiles([]);
        setTagInput("");
        setShowEntryForm(false);
      }
    } catch (error: any) {
      alert(error?.message || "Failed to create memory");
    } finally {
      setCreatingEntry(false);
      setUploadingImages(false);
    }
  };

  const handleEditEntry = (entryId: string) => {
    router.push(`/dashboard/trips/${tripId}/entries/${entryId}/edit`);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this memory? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const success = await deleteTripEntry(entryId);
      if (success) {
        setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
      } else {
        alert("Failed to delete memory");
      }
    } catch (error: any) {
      alert(error?.message || "Failed to delete memory");
    }
  };

  const handleDeleteTrip = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this trip? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const success = await deleteTrip(tripId);
      if (success) {
        router.push("/dashboard/trips");
      } else {
        alert("Failed to delete trip");
      }
    } catch (error: any) {
      alert(error?.message || "Failed to delete trip");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "excited":
        return "😃";
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😢";
      case "stressed":
        return "😰";
      default:
        return "😊";
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading..." subtitle="">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading trip details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout title="Trip Not Found" subtitle="">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            The trip you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={trip.title}
      subtitle={`${trip.destination} • ${formatDate(
        trip.start_date
      )} - ${formatDate(trip.end_date)} • Travel Journal`}
    >
      <div className="space-y-6">
        {/* Trip Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {trip.cover_image_url && (
            <div className="h-48 bg-gray-200 relative">
              <img
                src={trip.cover_image_url}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {trip.is_public ? (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <EyeOff className="w-4 h-4" />
                      Private
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {trip.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </div>
                </div>

                {trip.description && (
                  <p className="text-gray-700 mb-4">{trip.description}</p>
                )}

                {trip.tags && trip.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {trip.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/trips/${trip.id}/edit`)
                  }
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit trip"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteTrip}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete trip"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Entries Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Travel Memories
                </h2>
                <p className="text-gray-600 mt-1">
                  {entries.length}{" "}
                  {entries.length === 1 ? "memory" : "memories"}
                </p>
              </div>
              <button
                onClick={() => setShowEntryForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Memory</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {showEntryForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  New Memory
                </h3>
                <form onSubmit={handleCreateEntry} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={newEntry.title}
                        onChange={(e) =>
                          setNewEntry((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Memory title (e.g., First day in Paris)"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newEntry.entry_date}
                        onChange={(e) =>
                          setNewEntry((prev) => ({
                            ...prev,
                            entry_date: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={newEntry.content}
                      onChange={(e) =>
                        setNewEntry((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What happened on this day? Share your memories, experiences, and feelings..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newEntry.location}
                        onChange={(e) =>
                          setNewEntry((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Where were you on this day?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mood
                      </label>
                      <select
                        value={newEntry.mood}
                        onChange={(e) =>
                          setNewEntry((prev) => ({
                            ...prev,
                            mood: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="excited">😃 Excited</option>
                        <option value="happy">😊 Happy</option>
                        <option value="neutral">😐 Neutral</option>
                        <option value="sad">😢 Sad</option>
                        <option value="stressed">😰 Stressed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weather
                      </label>
                      <input
                        type="text"
                        value={newEntry.weather}
                        onChange={(e) =>
                          setNewEntry((prev) => ({
                            ...prev,
                            weather: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Sunny, rainy, etc."
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photos (up to 5)
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="image-upload"
                          disabled={selectedFiles.length >= 5}
                        />
                        <label
                          htmlFor="image-upload"
                          className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedFiles.length >= 5
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <Camera className="w-4 h-4" />
                          <span className="text-sm">
                            {selectedFiles.length >= 5
                              ? "Max 5 photos"
                              : "Add photos"}
                          </span>
                        </label>
                        {selectedFiles.length > 0 && (
                          <span className="text-sm text-gray-500">
                            {selectedFiles.length}/5 selected
                          </span>
                        )}
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEntryForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingEntry || !newEntry.title}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {creatingEntry ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>
                            {uploadingImages ? "Uploading..." : "Creating..."}
                          </span>
                        </>
                      ) : (
                        <span>Save Memory</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {entries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No memories yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start documenting your travel memories by adding your first
                  entry
                </p>
                <button
                  onClick={() => setShowEntryForm(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Memory</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {entry.title}
                          </h3>
                          <span className="text-2xl">
                            {getMoodIcon(entry.mood || "happy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>{formatDate(entry.entry_date)}</span>
                          {entry.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {entry.location}
                            </span>
                          )}
                          {entry.weather && <span>☀️ {entry.weather}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditEntry(entry.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit memory"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete memory"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {entry.content && (
                      <p className="text-gray-700 mb-3">{entry.content}</p>
                    )}

                    {entry.image_urls && entry.image_urls.length > 0 && (
                      <div className="mb-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {entry.image_urls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Memory photo ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
