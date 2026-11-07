"use client";

import React from "react";
import { ToastMessage } from "@/types/place";
import { CheckCircle2, AlertCircle, Loader2, Info, X, ExternalLink } from "lucide-react";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-fade-in ${
            toast.type === "success"
              ? "bg-[#142328]/95 border-emerald-500/40 text-emerald-100"
              : toast.type === "error"
              ? "bg-[#281717]/95 border-rose-500/40 text-rose-100"
              : toast.type === "loading"
              ? "bg-[#182330]/95 border-spotly-primary/50 text-sky-100"
              : "bg-spotly-card/95 border-slate-700 text-slate-100"
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            {toast.type === "loading" && (
              <Loader2 className="w-5 h-5 text-spotly-primary animate-spin" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-spotly-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-wide">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-spotly-muted mt-0.5 leading-relaxed break-words">
                {toast.message}
              </p>
            )}
            {toast.txHash && (
              <a
                href={`https://scan.bohr.life/tx/${toast.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-spotly-primary hover:text-sky-300 mt-1.5 underline underline-offset-2 transition-colors"
              >
                View on BohrScan
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-spotly-muted hover:text-white p-1 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

