"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Plus,
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
    notes?: string;
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
    notes: memory.notes || "",
    location: memory.location,
    tags: memory.tags || [],
  });
  const [noteInput, setNoteInput] = useState("");
  const [notesList, setNotesList] = useState<string[]>(
    memory.notes
      ? memory.notes
          .split("\n")
          .filter((note) => note.trim())
          .map((note) => (note.startsWith("- ") ? note : `- ${note}`))
      : []
  );
  const [tagInput, setTagInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update formData when memory prop changes (for real-time updates)
  useEffect(() => {
    setFormData({
      title: memory.title,
      content: memory.content || "",
      notes: memory.notes || "",
      location: memory.location,
      tags: memory.tags || [],
    });

    // Update notes list when memory notes change
    setNotesList(
      memory.notes
        ? memory.notes
            .split("\n")
            .filter((note) => note.trim())
            .map((note) => (note.startsWith("- ") ? note : `- ${note}`))
        : []
    );
  }, [memory]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update main fields
      const updated = await updateTripEntry(memory.id, {
        title: formData.title,
        content: formData.content,
        location: formData.location,
        tags: formData.tags,
      });

      // Update notes field separately
      if (updated) {
        const notesString = notesList.join("\n");
        const { error: notesError } = await supabase
          .from("trip_entries")
          .update({ notes: notesString })
          .eq("id", memory.id);

        if (notesError) {
          console.error("Error updating notes:", notesError);
        }

        const updatedMemory = {
          ...memory,
          title: formData.title,
          content: formData.content,
          notes: notesList.join("\n"),
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

  const handleAddNote = () => {
    if (noteInput.trim()) {
      // Split by lines and add dash to each line
      const lines = noteInput.split("\n").filter((line) => line.trim());
      const notesWithDashes = lines.map((line) => `- ${line.trim()}`);
      setNotesList((prev) => [...prev, ...notesWithDashes]);
      setNoteInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleRemoveNote = (indexToRemove: number) => {
    setNotesList((prev) => prev.filter((_, index) => index !== indexToRemove));
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
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="relative h-80 sm:h-96 overflow-hidden group">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
            onClick={() => openImageViewer(0)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* View Full Size Indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Header Content */}
          <div className="absolute top-0 left-0 right-0 p-6">
            <div className="flex items-center justify-end">
              <button
                onClick={onClose}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="text-3xl sm:text-4xl font-bold text-white bg-transparent border-none outline-none placeholder-white/80 flex-1"
                  placeholder="Memory title"
                />
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white flex-1">
                    {memory.title}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all"
                    title="Edit memory"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 text-white/90 text-sm">
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
                    className="bg-transparent border-none outline-none placeholder-white/60"
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
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Content */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Content</h3>
            </div>

            {isEditing ? (
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50"
                placeholder="Write detailed content about your memory..."
              />
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 min-h-[120px]">
                <p className="text-gray-700 leading-relaxed">
                  {memory.content || (
                    <span className="text-gray-400 italic">
                      No content added yet. Click edit to add your thoughts
                      about this memory.
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
          {/* Notes Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={noteInput}
                    onChange={(e) => {
                      setNoteInput(e.target.value);
                      // Auto-resize the textarea
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 200) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                    className="w-full px-4 py-4 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-none min-h-[80px] max-h-[200px] overflow-y-auto text-sm leading-relaxed"
                    placeholder="Write your notes here...&#10;You can write multiple lines&#10;Press Enter to add them as separate notes"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                    title="Add note"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {notesList.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="space-y-2">
                      {notesList.map((note, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-gray-700 flex-1 leading-relaxed">
                            {note}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveNote(index)}
                            className="text-red-400 hover:text-red-600 transition-colors text-sm font-medium"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 min-h-[120px]">
                {notesList.length > 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <ul className="space-y-2">
                      {notesList.map((note, index) => (
                        <li
                          key={index}
                          className="text-gray-700 leading-relaxed py-1 border-b border-gray-100 last:border-b-0"
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    No notes added yet. Click edit to add your thoughts about
                    this memory.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tags Section */}
          {(formData.tags && formData.tags.length > 0) || isEditing ? (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
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
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                        placeholder="Add tags (comma separated)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="absolute top-3 right-3 p-2 text-gray-400 hover:text-purple-600 transition-all duration-200 hover:scale-105"
                      title="Add tag"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => {
                        const color = colorFor(tag);
                        return (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-2 px-4 py-2 ${color.bg} ${color.fg} rounded-full text-sm font-medium`}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className={`${color.close} hover:scale-110 transition-transform`}
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
                  {formData.tags?.map((tag, index) => {
                    const color = colorFor(tag);
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center px-4 py-2 ${color.bg} ${color.fg} rounded-full text-sm font-medium`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {/* Additional Images */}
          {memory.imageUrls && memory.imageUrls.length > 1 && (
            <div className="mt-8 mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {memory.imageUrls.slice(1).map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Memory photo ${index + 2}`}
                      className="w-full h-48 object-cover rounded-xl shadow-sm cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                      onClick={() => openImageViewer(index + 1)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl pointer-events-none"></div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Camera className="w-4 h-4 text-gray-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6 flex justify-end gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
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
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
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
