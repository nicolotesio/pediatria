import Link from "next/link";
import { cardGrid, pageContainer, pageDescription, pageMain, pageTitle, subtleLink } from "@/components/ui";

export default function CalcolatoriPage() {
  return (
    <main className={pageMain}>
      <div className={pageContainer}>
        
        <div className="mb-6">
          <Link
            href="/"
            className={subtleLink}
          >
            ← Torna alla home
          </Link>
        </div>

        <h1 className={pageTitle}>
          Calcolatori
        </h1>

        <p className={pageDescription}>
          Strumenti clinici rapidi
        </p>

        {/* GRID */}
        <div className={cardGrid}>
          
          <Link
            href="/calcolatori/who"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-2xl font-semibold">
              📈 WHO 0–2 anni
            </h2>

            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Centili di peso, lunghezza e circonferenza cranica
            </p>
          </Link>

          <Link
            href="/calcolatori/ines"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-2xl font-semibold">
              👶 INeS Neonatali
            </h2>

            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Centili per neonati italiani 24–42 settimane EG
            </p>
          </Link>

        </div>
      </div>
    </main>
  );
}