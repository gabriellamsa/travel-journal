"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createTrip } from "@/lib/trips";
import { TripCreate } from "@/lib/types";
import { MapPin, Calendar, Tag, Eye, EyeOff, Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateTrip() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TripCreate>({
    title: "",
    description: "",
    destination: "",
    start_date: "",
    end_date: "",
    is_public: true,
    status: "completed",
    tags: [],
    budget: undefined,
    currency: "USD",
  });
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const normalizeTags = (raw: string): string[] => {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const newTags = normalizeTags(tagInput);
    if (newTags.length === 0) return;
    setFormData((prev) => {
      const existing = new Set(prev.tags || []);
      newTags.forEach((t) => existing.add(t));
      return { ...prev, tags: Array.from(existing) };
    });
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trip = await createTrip(formData);
      router.push(`/dashboard/trips/${trip.id}`);
    } catch (error: any) {
      console.error("Error creating trip:", error);
      alert(error?.message || "Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.destination.trim() &&
      formData.start_date &&
      formData.end_date &&
      new Date(formData.start_date) <= new Date(formData.end_date)
    );
  };

  return (
    <DashboardLayout
      title="Create a Trip"
      subtitle="Document your past adventures and memories"
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trip Details
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trip Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., My Summer Adventure in Paris"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trip Summary
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your overall experience and highlights from this trip..."
                />
              </div>

              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destination *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Paris, France"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              When Did You Travel?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trip Categories
            </h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.includes(",")) {
                        // adiciona tags quando vírgula é digitada
                        setTagInput(value);
                        handleAddTag();
                      } else {
                        setTagInput(value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ",") {
                        e.preventDefault();
                        handleAddTag();
                      }
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add categories (e.g., adventure, culture, food, family, solo)"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => {
                    const palette = [
                      {
                        bg: "bg-blue-100",
                        fg: "text-blue-800",
                        close: "text-blue-600 hover:text-blue-800",
                      },
                      {
                        bg: "bg-emerald-100",
                        fg: "text-emerald-800",
                        close: "text-emerald-600 hover:text-emerald-800",
                      },
                      {
                        bg: "bg-purple-100",
                        fg: "text-purple-800",
                        close: "text-purple-600 hover:text-purple-800",
                      },
                      {
                        bg: "bg-amber-100",
                        fg: "text-amber-800",
                        close: "text-amber-600 hover:text-amber-800",
                      },
                      {
                        bg: "bg-rose-100",
                        fg: "text-rose-800",
                        close: "text-rose-600 hover:text-rose-800",
                      },
                      {
                        bg: "bg-cyan-100",
                        fg: "text-cyan-800",
                        close: "text-cyan-600 hover:text-cyan-800",
                      },
                    ];
                    // hash determinístico simples baseado no conteúdo da tag
                    let hash = 0;
                    for (let i = 0; i < tag.length; i++)
                      hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
                    const color = palette[hash % palette.length];
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-1 px-3 py-1 ${color.bg} ${color.fg} rounded-full text-sm`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className={`${color.close}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Trip Cost removed as requested */}

          {/* Settings */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="is_public"
                    className="text-sm font-medium text-gray-700"
                  >
                    Make this trip public
                  </label>
                  <p className="text-sm text-gray-500">
                    Public trips can be viewed by anyone
                  </p>
                </div>
                <div className="flex items-center">
                  {formData.is_public ? (
                    <Eye className="w-5 h-5 text-blue-600 mr-2" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <input
                    type="checkbox"
                    id="is_public"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
