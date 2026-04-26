"use client";

import Link from "next/link";
import { pageContainer, pageDescription, pageMain, pageTitle } from "@/components/ui";
import ThemeToggle from "@/components/theme-toggle";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon?: string;
}

export default function ComingSoonPage({
  title,
  description,
  icon = "🚀",
}: ComingSoonPageProps) {
  return (
    <main className={pageMain}>
      <div className={pageContainer}>
        {/* HEADER */}
        <div className="mb-12 flex items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-4"
            >
              ← Back
            </Link>

            <h1 className={pageTitle}>{title}</h1>

            <p className={pageDescription}>{description}</p>
          </div>

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* PLACEHOLDER CONTENT */}
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-6xl mb-6">{icon}</div>

          <h2 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Sezione in sviluppo
          </h2>

          <p className="mb-4 text-lg text-slate-600 dark:text-slate-300">
            Stai lavorando per migliorare questa sezione. Il contenuto sarà disponibile nelle versioni future.
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Torna alla <Link href="/" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">pagina principale</Link> per accedere alle altre funzioni.
          </p>
        </div>
      </div>
    </main>
  );
}
