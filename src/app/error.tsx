"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
  MessageCircle,
  Home,
} from "lucide-react";
import { STORE_WHATSAPP } from "@/lib/constants";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log exception for debugging and telemetry
    console.error("[RUNTIME_ERROR_BOUNDARY]", error);
  }, [error]);

  const reportWhatsAppUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\+/g, "")}?text=${encodeURIComponent(
    `Hi MuscleWorks Support, I encountered a technical issue on the website: "${error.message || "Unknown error"}" (Digest: ${error.digest || "N/A"})`
  )}`;

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">
        {/* Warning Icon Badge */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-primary shadow-xl ring-1 ring-primary/30 sm:h-24 sm:w-24">
          <AlertTriangle
            className="h-10 w-10 text-primary sm:h-12 sm:w-12"
            aria-hidden="true"
          />
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <span>System Alert</span>
          <span className="text-muted-foreground">•</span>
          <span>Application Error</span>
        </div>

        {/* Headings */}
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Something Went Off Track
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-md mx-auto">
          We encountered an unexpected error while preparing your supplements view.
          Please try refreshing or reach out to our Golfutar support team.
        </p>

        {/* Development Error Diagnostics Box */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left font-mono text-xs text-muted-foreground shadow-inner overflow-x-auto">
            <p className="font-bold text-primary mb-1">Developer Diagnostics (Dev Mode Only):</p>
            <p className="text-foreground break-words">{error.message || "No error message provided"}</p>
            {error.digest && (
              <p className="mt-1 text-muted-foreground">Error Digest: {error.digest}</p>
            )}
          </div>
        )}

        {/* Recovery Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98]"
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            <span>Try Again</span>
          </button>

          <a
            href={reportWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-success px-6 text-base font-semibold text-success-foreground shadow-lg shadow-success/20 transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            <span>WhatsApp Support</span>
          </a>

          <Link
            href="/"
            className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-5 text-base font-semibold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
