"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Edit,
  MapPin,
  Calendar,
  Tag,
  Camera,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { updateTripEntry } from "@/lib/trips";
import { TripEntry } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MemoryModalProps {
  memory: {
    id: string;
    title: string;
    location: string;
    date: string;
    imageUrl: string;
    content?: string;
    mood?: string;
    tags?: string[];
    imageUrls?: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedMemory: any) => void;
}

export default function MemoryModal({
  memory,
  isOpen,
  onClose,
  onUpdate,
}: MemoryModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: memory.title,
    content: memory.content || "",
    location: memory.location,
    tags: memory.tags || [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateTripEntry(memory.id, {
        title: formData.title,
        content: formData.content,
        location: formData.location,
        tags: formData.tags,
      });

      if (updated) {
        const updatedMemory = {
          ...memory,
          title: formData.title,
          content: formData.content,
          location: formData.location,
          tags: formData.tags,
        };

        onUpdate(updatedMemory);

        // Dispatch event to update other components
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("memoryUpdated", {
              detail: { memory: updatedMemory },
            })
          );
        }

        setIsEditing(false);
      }
    } catch (error: any) {
      alert(error?.message || "Failed to update memory");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
  };

  const getAllImages = () => {
    // Combine imageUrl and imageUrls, avoiding duplicates
    const allImages = [memory.imageUrl];
    if (memory.imageUrls) {
      memory.imageUrls.forEach((url) => {
        if (url !== memory.imageUrl) {
          allImages.push(url);
        }
      });
    }
    return allImages;
  };

  const nextImage = () => {
    const allImages = getAllImages();
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    const allImages = getAllImages();
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!imageViewerOpen) return;

    switch (e.key) {
      case "Escape":
        closeImageViewer();
        break;
      case "ArrowLeft":
        previousImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    if (imageViewerOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [imageViewerOpen]);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Memory" : "Memory Details"}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit memory"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Hero Image */}
          <div
            className="relative h-64 sm:h-80 mb-6 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openImageViewer(0)}
          >
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 text-4xl">📸</div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-lg font-medium">
                Click to view full size
              </div>
            </div>
          </div>

          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="text-3xl font-bold text-gray-900 mb-4 w-full border-none focus:ring-0 focus:outline-none"
              placeholder="Memory title"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {memory.title}
            </h1>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="border-none focus:ring-0 focus:outline-none bg-transparent"
                  placeholder="Location"
                />
              ) : (
                <span>{memory.location}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{memory.date}</span>
            </div>
          </div>

          {/* Tags */}
          {(memory.tags && memory.tags.length > 0) || isEditing ? (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              {isEditing ? (
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
                        placeholder="Add tags (comma separated)"
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
              ) : (
                <div className="flex flex-wrap gap-2">
                  {memory.tags?.map((tag, index) => {
                    const color = colorFor(tag);
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 ${color.bg} ${color.fg} rounded-full text-sm`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {/* Content */}
          <div className="prose max-w-none">
            {isEditing ? (
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Write about your memory..."
              />
            ) : (
              <div className="text-gray-700 leading-relaxed">
                {memory.content || "No content available for this memory."}
              </div>
            )}
          </div>

          {/* Additional Images */}
          {memory.imageUrls && memory.imageUrls.length > 1 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                More Photos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {memory.imageUrls.slice(1).map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Memory photo ${index + 2}`}
                      className="w-full h-48 object-cover rounded-lg shadow-sm cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => openImageViewer(index + 1)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {imageViewerOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={closeImageViewer}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation arrows */}
            {(() => {
              const allImages = getAllImages();
              return allImages.length > 1 ? (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              ) : null;
            })()}

            {/* Image */}
            <img
              src={(() => {
                const allImages = getAllImages();
                return allImages[currentImageIndex];
              })()}
              alt={`Memory photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image counter */}
            {(() => {
              const allImages = getAllImages();
              return allImages.length > 1 ? (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
