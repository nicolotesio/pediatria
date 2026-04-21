import Link from "next/link";

const mainSections = [
  { href: "/appunti", title: "Appunti", desc: "Appunti divisi per materia" },
  { href: "/emergenze", title: "Emergenze", desc: "WETFLAG, dosi rapide, algoritmi" },
  { href: "/calcolatori", title: "Calcolatori", desc: "Crescita, farmaci, idratazione" },
  { href: "/risorse", title: "Risorse", desc: "Linee guida e link utili" },
  { href: "/genitori", title: "Genitori", desc: "Info pratiche per le famiglie" },
  { href: "/info", title: "Informazioni", desc: "Progetto e disclaimer" },
];

const quickTools = [
  { href: "/calcolatori/wetflag", title: "WETFLAG" },
  { href: "/calcolatori/farmaci", title: "Farmaci" },
  { href: "/calcolatori/idratazione", title: "Idratazione" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl p-4">

        {/* HEADER */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold">
            Appunti di Pediatria
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Webapp personale di studio e supporto clinico
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Cerca appunti, farmaci, patologie..."
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>

        {/* SEZIONI PRINCIPALI */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {section.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* QUICK TOOLS */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
            Strumenti rapidi
          </h2>

          <div className="mt-3 flex gap-3 overflow-x-auto">
            {quickTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </div>

        {/* ULTIMI APPUNTI */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
            Ultimi appunti
          </h2>

          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium">
                Bronchiolite
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pneumologia
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium">
                Disidratazione
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gastroenterologia
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}