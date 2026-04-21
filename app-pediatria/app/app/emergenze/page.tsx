import Link from "next/link";

const emergencySections = [
  {
    href: "/emergenze/wetflag",
    title: "🚑 WETFLAG",
    desc: "Calcoli rapidi da peso o età",
  },
];

export default function EmergenzePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mt-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Emergenze
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Strumenti rapidi per la gestione in urgenza
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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