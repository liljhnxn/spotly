"use client";

import React from "react";
import { Sparkles, MapPin, Heart, Compass, ArrowDown } from "lucide-react";

interface HeroProps {
  totalPlaces: number;
  totalFavourites: number;
  onExploreClick: () => void;
  onAddClick: () => void;
}

export function Hero({
  totalPlaces,
  totalFavourites,
  onExploreClick,
  onAddClick,
}: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-spotly-card-border/40">
      {/* Editorial Background Lighting and Contours */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-spotly-primary/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] bg-spotly-coral/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Curated Editorial Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-spotly-card/90 border border-spotly-primary/30 shadow-lg text-xs font-medium text-spotly-primary mb-6">
          <Sparkles className="w-3.5 h-3.5 text-spotly-coral" />
          <span>Curated On-Chain Discovery — Botchain Testnet</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
          Discover Places <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-spotly-primary via-sky-300 to-spotly-coral bg-clip-text text-transparent italic font-serif">
            Worth Exploring.
          </span>
        </h1>

        {/* Tagline / Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-spotly-muted leading-relaxed font-light mb-10">
          Find Places. Share Experiences. A decentralized sanctuary of hidden gems,
          picturesque escapes, and unforgettable locations, verified and stored forever
          on-chain.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-spotly-primary hover:bg-spotly-primary-hover text-spotly-bg font-semibold text-sm shadow-xl shadow-sky-500/20 transition-all duration-200 active:scale-95"
          >
            <Compass className="w-4 h-4 stroke-[2.2]" />
            <span>Explore Places</span>
            <ArrowDown className="w-3.5 h-3.5 ml-1" />
          </button>

          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-spotly-card hover:bg-spotly-card-hover border border-spotly-card-border hover:border-spotly-coral/50 text-spotly-text font-semibold text-sm transition-all duration-200 active:scale-95 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-spotly-coral" />
            <span>Submit a Hidden Gem</span>
          </button>
        </div>

        {/* On-Chain Live Counters */}
        <div className="grid grid-cols-2 max-w-md mx-auto gap-4">
          {/* Total Places Counter */}
          <div className="glass-panel p-4 rounded-2xl border border-spotly-card-border/80 flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-xl bg-spotly-primary/10 border border-spotly-primary/20 flex items-center justify-center text-spotly-primary shrink-0">
              <MapPin className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white leading-none">
                {totalPlaces}
              </div>
              <div className="text-xs text-spotly-muted uppercase tracking-wider font-semibold mt-1">
                Total Places
              </div>
            </div>
          </div>

          {/* Total Favourites Counter */}
          <div className="glass-panel p-4 rounded-2xl border border-spotly-card-border/80 flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-xl bg-spotly-coral/10 border border-spotly-coral/20 flex items-center justify-center text-spotly-coral shrink-0">
              <Heart className="w-6 h-6 stroke-[2] fill-spotly-coral/20" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white leading-none">
                {totalFavourites}
              </div>
              <div className="text-xs text-spotly-muted uppercase tracking-wider font-semibold mt-1">
                Total Favourites
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

