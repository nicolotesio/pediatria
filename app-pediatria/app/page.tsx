import Link from "next/link";

const mainSections = [
  {
    href: "/appunti",
    title: "Appunti",
    desc: "Appunti divisi per materia",
  },
  {
    href: "/emergenze",
    title: "Emergenze",
    desc: "WETFLAG, dosi rapide, algoritmi",
  },
  {
    href: "/calcolatori",
    title: "Calcolatori",
    desc: "Crescita, farmaci, idratazione",
  },
  {
    href: "/risorse",
    title: "Risorse",
    desc: "Linee guida e link utili",
  },
];

const quickTools = [
  {
    href: "/calcolatori/wetflag",
    title: "WETFLAG",
  },
  {
    href: "/calcolatori/farmaci",
    title: "Farmaci",
  },
  {
    href: "/calcolatori/idratazione",
    title: "Idratazione",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Appunti di Pediatria
          </h1>
          <p className="text-sm text-slate-600">
            Webapp personale di studio e supporto clinico
          </p>
        </div>

        {/* SEARCH (placeholder) */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Cerca appunti, farmaci, patologie..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SEZIONI PRINCIPALI */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {mainSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {section.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* QUICK TOOLS */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-slate-500 uppercase">
            Strumenti rapidi
          </h2>

          <div className="mt-3 flex gap-3 overflow-x-auto">
            {quickTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </div>

        {/* ULTIMI APPUNTI (placeholder) */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-slate-500 uppercase">
            Ultimi appunti
          </h2>

          <div className="mt-3 space-y-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-900">
                Bronchiolite
              </p>
              <p className="text-xs text-slate-500">
                Pneumologia
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-900">
                Disidratazione
              </p>
              <p className="text-xs text-slate-500">
                Gastroenterologia
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}