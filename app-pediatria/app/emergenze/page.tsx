import Link from "next/link";
import { cardGrid, pageContainer, pageMain, pageTitle, pageDescription, subtleLink } from "@/components/ui";

const emergencySections = [
  {
    href: "/emergenze/wetflag",
    title: "WETFLAG",
    desc: "Calcoli rapidi da peso o età",
  },
];

export default function EmergenzePage() {
  return (
    <main className={pageMain}>
      <div className={pageContainer}>

        {/* BACK HOME */}
        <div className="mb-4">
          <Link
            href="/"
            className={subtleLink}
          >
            ← Torna alla home
          </Link>
        </div>

        {/* TITLE */}
        <div className="mt-2">
          <h1 className={`flex items-center gap-2 ${pageTitle}`}>
            <span>🚑</span>
            Emergenze
          </h1>

          <p className={pageDescription}>
            Strumenti rapidi per la gestione in urgenza
          </p>
        </div>

        {/* GRID */}
        <div className={cardGrid}>
          {emergencySections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-2xl font-semibold">{section.title}</h2>

              <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                {section.desc}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}