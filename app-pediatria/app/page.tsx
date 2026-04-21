import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

const mainSections = [
  { href: "/appunti", title: "Appunti", desc: "Appunti divisi per materia" },
  { href: "/emergenze", title: "Emergenze", desc: "WETFLAG, dosi rapide, algoritmi" },
  { href: "/calcolatori", title: "Calcolatori", desc: "Crescita, farmaci, scores clinici" },
  { href: "/risorse", title: "Risorse", desc: "Linee guida e link utili" },
  { href: "/genitori", title: "Genitori", desc: "Info pratiche per le famiglie" },
  { href: "/info", title: "Informazioni", desc: "Progetto e disclaimer" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl p-6">

        {/* HEADER */}
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Appunti di <span className="text-blue-500">Pediatria</span>
            </h1>

            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-200">
              di Dr Nicolò Tesio
            </p>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Webapp personale di studio e supporto clinico
            </p>
          </div>

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-8 relative">
          <input
            type="text"
            placeholder="Cerca: bronchiolite, febbre, paracetamolo..."
            className="w-full rounded-2xl border border-slate-300 bg-white p-4 pl-12 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>

        {/* SEZIONI PRINCIPALI */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mainSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-2xl font-semibold">
                {section.title}
              </h2>

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