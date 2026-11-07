"use client";

import React from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/config/chain";
import { Compass, Wallet, Plus, ChevronDown, Check, LogOut, Globe } from "lucide-react";

interface NavbarProps {
  onOpenAddModal: () => void;
}

export function Navbar({ onOpenAddModal }: NavbarProps) {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({
    address,
    chainId: botchainTestnet.id,
  });

  const [menuOpen, setMenuOpen] = React.useState(false);

  const isWrongNetwork = isConnected && chain?.id !== botchainTestnet.id;

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    const mmConnector =
      connectors.find((c) => c.id === "injected" || c.name.toLowerCase().includes("metamask")) ||
      connectors[0];
    if (mmConnector) {
      connect({ connector: mmConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-spotly-card-border/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-spotly-primary to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-spotly-bg">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-spotly-text">
                Spotly
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-spotly-primary/10 text-spotly-primary border border-spotly-primary/30">
                Web3
              </span>
            </div>
            <p className="text-xs text-spotly-muted hidden sm:block">
              Find Places. Share Experiences.
            </p>
          </div>
        </div>

        {/* Center / Network Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-spotly-card border border-spotly-card-border/80 text-xs text-spotly-muted">
          <span
            className={`w-2 h-2 rounded-full ${
              isWrongNetwork
                ? "bg-amber-400 animate-pulse"
                : isConnected
                ? "bg-emerald-400 shadow-sm shadow-emerald-400"
                : "bg-slate-500"
            }`}
          />
          <Globe className="w-3.5 h-3.5 text-spotly-primary" />
          <span>Botchain Testnet</span>
          <span className="text-spotly-subtle">#{botchainTestnet.id}</span>
        </div>

        {/* Actions / Wallet */}
        <div className="flex items-center gap-3">
          {isWrongNetwork ? (
            <button
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
            >
              Switch to Botchain
            </button>
          ) : null}

          {/* Submit Place CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-spotly-coral hover:bg-spotly-coral-hover text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-900/30 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add a Place</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Wallet Connection */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-spotly-card hover:bg-spotly-card-hover border border-spotly-card-border text-spotly-text text-xs sm:text-sm font-medium transition-all duration-200 hover:border-spotly-primary/40 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4 text-spotly-primary" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-spotly-card hover:bg-spotly-card-hover border border-spotly-card-border text-xs sm:text-sm font-medium transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="font-mono text-spotly-text text-xs">
                    {address ? truncateAddress(address) : ""}
                  </span>
                  {balanceData && (
                    <span className="text-[10px] text-spotly-muted mt-0.5">
                      {parseFloat(balanceData.formatted).toFixed(3)} {balanceData.symbol}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-spotly-muted ml-0.5" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-spotly-card border border-spotly-card-border shadow-2xl p-2 z-20 animate-fade-in text-xs">
                    <div className="px-3 py-2 border-b border-spotly-card-border/60 mb-1">
                      <p className="text-spotly-muted text-[11px]">Connected as</p>
                      <p className="font-mono text-spotly-text text-xs break-all mt-0.5">
                        {address}
                      </p>
                    </div>

                    <a
                      href={`https://scan.bohr.life/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-spotly-text hover:bg-spotly-card-hover transition-colors"
                    >
                      <span>View on BohrScan</span>
                      <Globe className="w-3.5 h-3.5 text-spotly-primary" />
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                    >
                      <span>Disconnect Wallet</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

