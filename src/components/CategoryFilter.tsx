"use client";

import React from "react";
import { Category, CATEGORIES } from "@/types/place";
import {
  Sparkles,
  Utensils,
  Trees,
  Building2,
  Film,
  Gem,
  LayoutGrid,
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string; // "All" or a Category
  onSelectCategory: (category: string) => void;
  activeTab: "explore" | "my-submissions" | "my-favourites";
  onSelectTab: (tab: "explore" | "my-submissions" | "my-favourites") => void;
  mySubmissionsCount: number;
  myFavouritesCount: number;
  isWalletConnected: boolean;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  activeTab,
  onSelectTab,
  mySubmissionsCount,
  myFavouritesCount,
  isWalletConnected,
}: CategoryFilterProps) {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Restaurants":
        return <Utensils className="w-3.5 h-3.5" />;
      case "Nature":
        return <Trees className="w-3.5 h-3.5" />;
      case "Hotels":
        return <Building2 className="w-3.5 h-3.5" />;
      case "Entertainment":
        return <Film className="w-3.5 h-3.5" />;
      case "Hidden Gems":
        return <Gem className="w-3.5 h-3.5 text-spotly-coral" />;
      default:
        return <LayoutGrid className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section View Tabs: Explore All / My Submissions / My Favourites */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-spotly-card-border/60 pb-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-spotly-card border border-spotly-card-border/80 text-xs">
          <button
            onClick={() => onSelectTab("explore")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "explore"
                ? "bg-spotly-primary text-spotly-bg font-semibold shadow-md shadow-sky-500/20"
                : "text-spotly-muted hover:text-spotly-text"
            }`}
          >
            Explore All Places
          </button>

          <button
            onClick={() => onSelectTab("my-submissions")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "my-submissions"
                ? "bg-spotly-primary text-spotly-bg font-semibold shadow-md shadow-sky-500/20"
                : "text-spotly-muted hover:text-spotly-text"
            }`}
          >
            <span>My Places</span>
            {isWalletConnected && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === "my-submissions"
                    ? "bg-spotly-bg/20 text-spotly-bg"
                    : "bg-spotly-card-border text-spotly-muted"
                }`}
              >
                {mySubmissionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab("my-favourites")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "my-favourites"
                ? "bg-spotly-coral text-white font-semibold shadow-md shadow-rose-900/30"
                : "text-spotly-muted hover:text-spotly-text"
            }`}
          >
            <span>My Favourites</span>
            {isWalletConnected && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === "my-favourites"
                    ? "bg-black/20 text-white"
                    : "bg-spotly-card-border text-spotly-muted"
                }`}
              >
                {myFavouritesCount}
              </span>
            )}
          </button>
        </div>

        {/* View mode indicator */}
        <div className="text-xs text-spotly-subtle flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-spotly-primary" />
          <span>
            {activeTab === "explore"
              ? "Displaying community submissions"
              : activeTab === "my-submissions"
              ? "Displaying places submitted by your wallet"
              : "Displaying your on-chain saved favourites"}
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory("All")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
            selectedCategory === "All"
              ? "bg-spotly-primary text-spotly-bg font-semibold shadow-md shadow-sky-500/20"
              : "bg-spotly-card hover:bg-spotly-card-hover border border-spotly-card-border text-spotly-muted hover:text-white"
          }`}
        >
          {getCategoryIcon("All")}
          <span>All Categories</span>
        </button>

        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
                isActive
                  ? "bg-spotly-primary text-spotly-bg font-semibold shadow-md shadow-sky-500/20"
                  : "bg-spotly-card hover:bg-spotly-card-hover border border-spotly-card-border text-spotly-muted hover:text-white"
              }`}
            >
              {getCategoryIcon(category)}
              <span>{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

