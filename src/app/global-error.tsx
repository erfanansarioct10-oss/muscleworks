"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[CRITICAL_ROOT_ERROR]", error);
  }, [error]);

  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col items-center justify-center bg-[#09090b] text-[#f4f4f5] font-sans p-6 antialiased">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 shadow-xl">
            <AlertTriangle className="h-10 w-10" aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Critical System Error
          </h1>
          <p className="mt-3 text-base text-zinc-400">
            A critical application error occurred. Please reload to restore the session.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-base font-semibold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              <span>Reload Application</span>
            </button>
            <Link
              href="/"
              className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-5 text-base font-semibold text-zinc-100 hover:bg-zinc-800 active:scale-[0.98]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
