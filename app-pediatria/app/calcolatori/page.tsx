import Link from "next/link";

export default function CalcolatoriPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl p-6">
        
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Torna alla home
          </Link>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Calcolatori
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Strumenti clinici rapidi
        </p>

        {/* GRID */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          
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