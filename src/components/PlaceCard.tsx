"use client";

import React, { useState } from "react";
import { Place } from "@/types/place";
import {
  MapPin,
  Heart,
  Calendar,
  User,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

interface PlaceCardProps {
  place: Place;
  currentUserAddress?: string;
  isFavourited: boolean;
  onToggleFavourite: (placeId: bigint, currentlyFavourited: boolean) => Promise<void>;
  onRemovePlace: (placeId: bigint) => Promise<void>;
  isProcessingFav: boolean;
  isProcessingRemove: boolean;
}

export function PlaceCard({
  place,
  currentUserAddress,
  isFavourited,
  onToggleFavourite,
  onRemovePlace,
  isProcessingFav,
  isProcessingRemove,
}: PlaceCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const isAuthor =
    currentUserAddress &&
    place.author.toLowerCase() === currentUserAddress.toLowerCase();

  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(Number(place.createdAt) * 1000);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  }, [place.createdAt]);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "Restaurants":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "Nature":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "Hotels":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
      case "Entertainment":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "Hidden Gems":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      default:
        return "bg-sky-500/10 text-sky-300 border-sky-500/30";
    }
  };

  return (
    <article className="glass-card rounded-3xl overflow-hidden flex flex-col group relative">
      {/* Visual Header / Photography Container */}
      <div className="relative aspect-[16/10] w-full bg-[#15202B] overflow-hidden">
        {place.imageUrl && !imageError ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-spotly-subtle p-6 text-center map-grid-bg">
            <div className="w-12 h-12 rounded-2xl bg-spotly-card-border/40 flex items-center justify-center text-spotly-muted mb-2">
              <ImageIcon className="w-6 h-6 stroke-[1.5]" />
            </div>
            <span className="text-xs text-spotly-muted font-medium">
              Location Snapshot
            </span>
          </div>
        )}

        {/* Gradient Overlay for Editorial Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2935] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Category Tag */}
          <span
            className={`text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full border backdrop-blur-md shadow-md ${getCategoryTheme(
              place.category
            )}`}
          >
            {place.category}
          </span>

          {/* Quick Favourite Heart Button over Image */}
          <button
            onClick={() => onToggleFavourite(place.id, isFavourited)}
            disabled={isProcessingFav}
            aria-label={isFavourited ? "Unsave favourite" : "Save to favourites"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg transition-all duration-200 ${
              isFavourited
                ? "bg-spotly-coral/90 text-white border-spotly-coral hover:bg-spotly-coral"
                : "bg-black/50 text-white border-white/20 hover:bg-black/70 hover:border-spotly-coral/60"
            } disabled:opacity-50`}
          >
            {isProcessingFav ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavourited ? "fill-white text-white" : "text-white"
                }`}
              />
            )}
            <span className="font-mono text-[11px]">
              {Number(place.favouriteCount)}
            </span>
          </button>
        </div>

        {/* Location Pin overlay bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white/90 drop-shadow">
          <MapPin className="w-3.5 h-3.5 text-spotly-primary shrink-0" />
          <span className="truncate max-w-[220px]">{place.location}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Place Title */}
          <h3 className="font-serif text-xl font-bold text-white group-hover:text-spotly-primary transition-colors leading-snug line-clamp-1">
            {place.name}
          </h3>

          {/* Place Description */}
          <p className="mt-3 text-xs sm:text-sm text-spotly-muted leading-relaxed line-clamp-3">
            {place.description}
          </p>
        </div>

        {/* Card Footer / Metadata */}
        <div className="mt-6 pt-4 border-t border-spotly-card-border/60 flex items-center justify-between text-xs text-spotly-subtle">
          {/* Author */}
          <div className="flex items-center gap-1.5 truncate max-w-[150px]">
            <User className="w-3.5 h-3.5 text-spotly-primary shrink-0" />
            <span className="truncate font-mono">
              {isAuthor ? (
                <span className="text-spotly-coral font-semibold">You</span>
              ) : (
                truncateAddress(place.author)
              )}
            </span>
          </div>

          {/* Date & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 text-spotly-muted" />
              <span>{formattedDate}</span>
            </div>

            {/* Remove Button for Author */}
            {isAuthor && (
              <div className="relative">
                {showConfirmRemove ? (
                  <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 rounded-lg p-1 animate-fade-in">
                    <button
                      onClick={() => {
                        setShowConfirmRemove(false);
                        onRemovePlace(place.id);
                      }}
                      disabled={isProcessingRemove}
                      className="px-2 py-0.5 rounded text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
                    >
                      {isProcessingRemove ? "..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setShowConfirmRemove(false)}
                      className="px-1 text-[10px] text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmRemove(true)}
                    className="p-1.5 rounded-lg text-spotly-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove this submission"
                    aria-label="Remove submission"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

