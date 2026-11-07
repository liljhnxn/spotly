"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PlaceCard } from "@/components/PlaceCard";
import { AddPlaceModal } from "@/components/AddPlaceModal";
import { ToastContainer } from "@/components/Toast";
import { SPOTLY_ABI } from "@/contracts/SpotlyABI";
import { CONTRACT_ADDRESS } from "@/config/contract";
import { botchainTestnet } from "@/config/chain";
import { Place, Category, ToastMessage } from "@/types/place";
import {
  Compass,
  Search,
  Sparkles,
  MapPin,
  AlertTriangle,
  FolderOpen,
  PlusCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function SpotlyApp() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: botchainTestnet.id });

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<
    "explore" | "my-submissions" | "my-favourites"
  >("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Action states
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);

  // Wagmi Write Contract Hook
  const { writeContractAsync } = useWriteContract();

  // Helper toast notifier
  const addToast = useCallback(
    (
      type: "info" | "success" | "error" | "loading",
      title: string,
      message?: string,
      txHash?: string
    ) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, message, txHash }]);

      if (type !== "loading") {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 7000);
      }
      return id;
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isContractConfigured =
    CONTRACT_ADDRESS &&
    CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  // Read: getAllPlaces
  const {
    data: rawPlaces,
    isLoading: isLoadingPlaces,
    refetch: refetchPlaces,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SPOTLY_ABI,
    functionName: "getAllPlaces",
    query: {
      enabled: isContractConfigured,
      refetchInterval: 12000,
    },
  });

  // Read: totalPlaces
  const { data: rawTotalPlaces, refetch: refetchTotalPlaces } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SPOTLY_ABI,
    functionName: "totalPlaces",
    query: {
      enabled: isContractConfigured,
    },
  });

  // Read: totalFavourites
  const { data: rawTotalFavourites, refetch: refetchTotalFavourites } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SPOTLY_ABI,
    functionName: "totalFavourites",
    query: {
      enabled: isContractConfigured,
    },
  });

  // Read: getUserFavourites
  const { data: rawUserFavs, refetch: refetchUserFavs } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SPOTLY_ABI,
    functionName: "getUserFavourites",
    args: address ? [address] : undefined,
    query: {
      enabled: isContractConfigured && !!address,
    },
  });

  // Re-fetch all contract state
  const refreshAll = useCallback(() => {
    if (isContractConfigured) {
      refetchPlaces();
      refetchTotalPlaces();
      refetchTotalFavourites();
      if (address) refetchUserFavs();
    }
  }, [
    isContractConfigured,
    refetchPlaces,
    refetchTotalPlaces,
    refetchTotalFavourites,
    refetchUserFavs,
    address,
  ]);

  // Transformed Places
  const allPlaces: Place[] = useMemo(() => {
    if (!rawPlaces || !Array.isArray(rawPlaces)) return [];
    return rawPlaces.map((p: any) => ({
      id: BigInt(p.id),
      author: p.author as `0x${string}`,
      name: p.name,
      location: p.location,
      description: p.description,
      category: p.category,
      imageUrl: p.imageUrl,
      createdAt: BigInt(p.createdAt),
      favouriteCount: BigInt(p.favouriteCount),
      exists: Boolean(p.exists),
      isRemoved: Boolean(p.isRemoved),
    }));
  }, [rawPlaces]);

  // Set of user-favourited place IDs
  const userFavouritedSet = useMemo(() => {
    const set = new Set<string>();
    if (rawUserFavs && Array.isArray(rawUserFavs)) {
      rawUserFavs.forEach((p: any) => {
        set.add(p.id.toString());
      });
    }
    return set;
  }, [rawUserFavs]);

  // My Submissions
  const mySubmissions = useMemo(() => {
    if (!address) return [];
    return allPlaces.filter(
      (p) => p.author.toLowerCase() === address.toLowerCase()
    );
  }, [allPlaces, address]);

  // My Favourites
  const myFavourites = useMemo(() => {
    if (!address) return [];
    return allPlaces.filter((p) => userFavouritedSet.has(p.id.toString()));
  }, [allPlaces, address, userFavouritedSet]);

  // Filtered places based on activeTab, category, and search query
  const displayedPlaces = useMemo(() => {
    let list: Place[] = [];
    if (activeTab === "explore") {
      list = allPlaces;
    } else if (activeTab === "my-submissions") {
      list = mySubmissions;
    } else if (activeTab === "my-favourites") {
      list = myFavourites;
    }

    // Category filter
    if (selectedCategory !== "All") {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allPlaces, mySubmissions, myFavourites, activeTab, selectedCategory, searchQuery]);

  // Handlers
  const handleAddPlace = async (formData: {
    name: string;
    location: string;
    description: string;
    category: Category;
    imageUrl: string;
  }) => {
    if (!isConnected) {
      addToast("error", "Wallet Not Connected", "Please connect MetaMask first.");
      return;
    }
    if (!isContractConfigured) {
      addToast("error", "Contract Not Deployed", "Please set NEXT_PUBLIC_CONTRACT_ADDRESS.");
      return;
    }

    const toastId = addToast(
      "loading",
      "Submitting to Botchain...",
      "Waiting for wallet signature and block confirmation."
    );
    setActionProcessingId("submit");

    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SPOTLY_ABI,
        functionName: "submitPlace",
        args: [
          formData.name,
          formData.location,
          formData.description,
          formData.category,
          formData.imageUrl,
        ],
      });

      dismissToast(toastId);
      addToast(
        "loading",
        "Transaction Broadcasted",
        "Confirming block on Botchain Testnet...",
        hash
      );

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      dismissToast(toastId);
      addToast(
        "success",
        "Place Published!",
        `"${formData.name}" is now live on Spotly!`,
        hash
      );
      refreshAll();
    } catch (err: any) {
      console.error(err);
      dismissToast(toastId);
      addToast(
        "error",
        "Submission Failed",
        err?.shortMessage || err?.message || "User rejected or execution reverted."
      );
      throw err;
    } finally {
      setActionProcessingId(null);
    }
  };

  const handleToggleFavourite = async (
    placeId: bigint,
    currentlyFavourited: boolean
  ) => {
    if (!isConnected) {
      addToast("error", "Wallet Not Connected", "Connect MetaMask to save favourites.");
      return;
    }
    if (!isContractConfigured) {
      addToast("error", "Contract Not Deployed", "Contract address is not configured.");
      return;
    }

    const actionKey = `fav-${placeId.toString()}`;
    setActionProcessingId(actionKey);

    const actionLabel = currentlyFavourited ? "Unsaving favourite" : "Saving favourite";
    const toastId = addToast(
      "loading",
      `${actionLabel}...`,
      "Submitting transaction to Botchain..."
    );

    try {
      const functionName = currentlyFavourited ? "unsaveFavourite" : "saveFavourite";
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SPOTLY_ABI,
        functionName,
        args: [placeId],
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      dismissToast(toastId);
      addToast(
        "success",
        currentlyFavourited ? "Removed from Favourites" : "Saved to Favourites!",
        `Place #${placeId.toString()} updated on-chain.`,
        hash
      );
      refreshAll();
    } catch (err: any) {
      console.error(err);
      dismissToast(toastId);
      addToast(
        "error",
        "Favourite Action Failed",
        err?.shortMessage || err?.message || "Transaction reverted."
      );
    } finally {
      setActionProcessingId(null);
    }
  };

  const handleRemovePlace = async (placeId: bigint) => {
    if (!isConnected) {
      addToast("error", "Wallet Not Connected", "Connect wallet to manage submissions.");
      return;
    }

    const actionKey = `remove-${placeId.toString()}`;
    setActionProcessingId(actionKey);

    const toastId = addToast(
      "loading",
      "Removing Place...",
      "Removing your submission on-chain..."
    );

    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SPOTLY_ABI,
        functionName: "removePlace",
        args: [placeId],
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      dismissToast(toastId);
      addToast(
        "success",
        "Place Removed",
        `Submission #${placeId.toString()} was removed from Spotly.`,
        hash
      );
      refreshAll();
    } catch (err: any) {
      console.error(err);
      dismissToast(toastId);
      addToast(
        "error",
        "Removal Failed",
        err?.shortMessage || err?.message || "Transaction reverted."
      );
    } finally {
      setActionProcessingId(null);
    }
  };

  const totalPlacesCount = rawTotalPlaces !== undefined ? Number(rawTotalPlaces) : allPlaces.length;
  const totalFavsCount = rawTotalFavourites !== undefined ? Number(rawTotalFavourites) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-spotly-bg text-spotly-text">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Unconfigured contract warning alert if address is zero */}
      {!isContractConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Smart Contract Not Yet Configured:</strong> Deploy Spotly using{" "}
                <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300">
                  npm run deploy:botchain
                </code>{" "}
                or set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Editorial Hero Section */}
        <Hero
          totalPlaces={totalPlacesCount}
          totalFavourites={totalFavsCount}
          onExploreClick={() => {
            document
              .getElementById("explore-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          onAddClick={() => setIsAddModalOpen(true)}
        />

        {/* Explore & My Places Section */}
        <section
          id="explore-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          {/* Header Controls: Search & Refresh */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-spotly-primary" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {activeTab === "explore"
                    ? "Explore Places"
                    : activeTab === "my-submissions"
                    ? "My Submissions"
                    : "My Saved Favourites"}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-spotly-muted mt-1">
                Authentic destinations contributed by global travelers on Botchain.
              </p>
            </div>

            {/* Search Bar & Refresh */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search spots, cities..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-spotly-card border border-spotly-card-border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-spotly-primary transition-colors"
                />
                <Search className="w-4 h-4 text-spotly-muted absolute left-3 top-2.5 pointer-events-none" />
              </div>

              <button
                onClick={refreshAll}
                className="p-2 rounded-xl bg-spotly-card hover:bg-spotly-card-hover border border-spotly-card-border text-spotly-muted hover:text-white transition-colors"
                title="Refresh from chain"
                aria-label="Refresh places from blockchain"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoadingPlaces ? "animate-spin text-spotly-primary" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Category and Tab Filter */}
          <div className="mb-10">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              mySubmissionsCount={mySubmissions.length}
              myFavouritesCount={myFavourites.length}
              isWalletConnected={isConnected}
            />
          </div>

          {/* Places Grid */}
          {isLoadingPlaces && allPlaces.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-spotly-primary border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-spotly-muted">
                Retrieving places from Botchain Testnet...
              </p>
            </div>
          ) : displayedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPlaces.map((place) => (
                <PlaceCard
                  key={place.id.toString()}
                  place={place}
                  currentUserAddress={address}
                  isFavourited={userFavouritedSet.has(place.id.toString())}
                  onToggleFavourite={handleToggleFavourite}
                  onRemovePlace={handleRemovePlace}
                  isProcessingFav={actionProcessingId === `fav-${place.id.toString()}`}
                  isProcessingRemove={
                    actionProcessingId === `remove-${place.id.toString()}`
                  }
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto border border-spotly-card-border/60">
              <div className="w-16 h-16 rounded-2xl bg-spotly-primary/10 border border-spotly-primary/20 flex items-center justify-center text-spotly-primary mx-auto mb-4">
                <FolderOpen className="w-8 h-8 stroke-[1.5]" />
              </div>

              <h3 className="font-serif text-xl font-bold text-white mb-2">
                {activeTab === "my-submissions"
                  ? "No Submissions Yet"
                  : activeTab === "my-favourites"
                  ? "No Favourites Saved"
                  : searchQuery
                  ? "No Matching Places Found"
                  : "No Places Submitted Yet"}
              </h3>

              <p className="text-xs sm:text-sm text-spotly-muted leading-relaxed mb-6">
                {activeTab === "my-submissions"
                  ? "You have not submitted any places to Spotly yet. Be the first to share an unforgettable location!"
                  : activeTab === "my-favourites"
                  ? "Explore places and click the heart icon to save spots to your personal travel itinerary."
                  : searchQuery
                  ? `No destinations match "${searchQuery}". Try a different location or clear the search.`
                  : "Be the pioneer traveler to record a hidden gem on Botchain Testnet!"}
              </p>

              {activeTab === "explore" && !searchQuery ? (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-spotly-coral hover:bg-spotly-coral-hover text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-900/30 transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit the First Place</span>
                </button>
              ) : searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-xl bg-spotly-card hover:bg-spotly-card-hover border border-spotly-card-border text-xs text-spotly-muted hover:text-white transition-colors"
                >
                  Clear Search Filter
                </button>
              ) : null}
            </div>
          )}
        </section>
      </main>

      {/* Add Place Modal */}
      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPlace}
        isSubmitting={actionProcessingId === "submit"}
      />

      {/* Editorial Travel Footer */}
      <footer className="border-t border-spotly-card-border/60 glass-panel mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-spotly-muted">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-spotly-primary" />
            <span className="font-serif font-bold text-white text-sm">Spotly</span>
            <span className="text-spotly-subtle">— Find Places. Share Experiences.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-spotly-primary flex items-center gap-1 transition-colors"
            >
              <span>BohrScan Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-spotly-subtle">•</span>
            <span>Network: Botchain (Chain ID: 968)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

