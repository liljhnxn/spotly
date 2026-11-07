"use client";

import React, { useState } from "react";
import { Category, CATEGORIES } from "@/types/place";
import { X, Sparkles, MapPin, Image as ImageIcon, Loader2 } from "lucide-react";

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    location: string;
    description: string;
    category: Category;
    imageUrl: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function AddPlaceModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddPlaceModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Hidden Gems");
  const [imageUrl, setImageUrl] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Please enter the place name.");
      return;
    }
    if (!location.trim()) {
      setFormError("Please enter a location or region.");
      return;
    }
    if (!description.trim()) {
      setFormError("Please provide a description or why it's worth visiting.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        location: location.trim(),
        description: description.trim(),
        category,
        imageUrl: imageUrl.trim(),
      });
      // Reset form
      setName("");
      setLocation("");
      setDescription("");
      setCategory("Hidden Gems");
      setImageUrl("");
      onClose();
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || "Failed to submit place. Check transaction.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-3xl bg-spotly-card border border-spotly-card-border/80 shadow-2xl z-10 overflow-hidden my-8 animate-fade-in">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-spotly-card-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-spotly-coral/10 border border-spotly-coral/30 flex items-center justify-center text-spotly-coral">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Share a New Place
              </h2>
              <p className="text-xs text-spotly-muted">
                Publish on-chain to Botchain Testnet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-spotly-muted hover:text-white hover:bg-spotly-card-hover transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          {/* Place Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Place Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fushimi Inari-taisha Shrine"
              className="w-full px-4 py-2.5 rounded-xl bg-[#14202B] border border-spotly-card-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-spotly-primary transition-colors"
            />
          </div>

          {/* Location & Category in a grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#14202B] border border-spotly-card-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-spotly-primary transition-colors"
                />
                <MapPin className="w-4 h-4 text-spotly-muted absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14202B] border border-spotly-card-border text-white text-sm focus:outline-none focus:border-spotly-primary transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description & Experience *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what makes this place special, best time to visit, tips for travelers..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#14202B] border border-spotly-card-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-spotly-primary transition-colors resize-none"
            />
          </div>

          {/* Image URL (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Photo Image URL <span className="text-spotly-subtle font-normal">(Optional)</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#14202B] border border-spotly-card-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-spotly-primary transition-colors"
              />
              <ImageIcon className="w-4 h-4 text-spotly-muted absolute left-3 top-3 pointer-events-none" />
            </div>

            {/* Live image preview thumbnail */}
            {imageUrl.trim() && !previewError && (
              <div className="mt-2.5 relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-spotly-card-border bg-[#14202B]">
                <img
                  src={imageUrl.trim()}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded font-medium">
                  Live Preview
                </span>
              </div>
            )}
            {imageUrl.trim() && previewError && (
              <p className="text-[11px] text-amber-400 mt-1">
                Unable to preview image from this link. Make sure it is a direct HTTPS image URL.
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-spotly-card-border/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-spotly-card-border text-spotly-muted hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-spotly-coral hover:bg-spotly-coral-hover text-white text-sm font-semibold shadow-lg shadow-rose-900/30 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Chain...</span>
                </>
              ) : (
                <span>Publish to Spotly</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

