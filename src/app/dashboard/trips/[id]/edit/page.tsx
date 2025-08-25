"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTrip, updateTrip } from "@/lib/trips";
import { Trip, TripUpdate } from "@/lib/types";
import { MapPin, Calendar, Tag, Eye, EyeOff, Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<TripUpdate>({});
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const t = await getTrip(tripId);
      if (!t) {
        router.push("/dashboard/trips");
        return;
      }
      setFormData({
        title: t.title,
        description: t.description || "",
        destination: t.destination,
        start_date: t.start_date,
        end_date: t.end_date,
        is_public: t.is_public,
        cover_image_url: t.cover_image_url || "",
        status: t.status,
        tags: t.tags || [],
      });
      setLoading(false);
    };
    if (tripId) init();
  }, [tripId, router]);

  const normalizeTags = (raw: string): string[] =>
    raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

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
      tags: (prev.tags || []).filter((t) => t !== tagToRemove),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((p) => ({ ...p, [name]: checked }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateTrip(tripId, formData);
      if (!updated) throw new Error("Failed to update trip");
      router.push(`/dashboard/trips/${tripId}`);
    } catch (err: any) {
      alert(err?.message || "Failed to update trip");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Trip" subtitle="">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

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

  const colorFor = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++)
      hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
    return palette[hash % palette.length];
  };

  return (
    <DashboardLayout title="Edit Trip" subtitle="Update your travel journal">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trip Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <textarea
                  name="description"
                  value={(formData.description as string) || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="destination"
                    value={formData.destination || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              When Did You Travel?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trip Categories
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "," || e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add categories (comma separated)"
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
                  {(formData.tags as string[]).map((tag, index) => {
                    const color = colorFor(tag);
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

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Settings
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
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
                  name="is_public"
                  checked={!!formData.is_public}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
