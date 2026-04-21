import Link from "next/link";

const sections = [
  { href: "/appunti", title: "Appunti", desc: "Appunti divisi per materia" },
  { href: "/emergenze", title: "Emergenze", desc: "WETFLAG, dosi rapide, algoritmi" },
  { href: "/calcolatori", title: "Calcolatori", desc: "Crescita, farmaci, idratazione" },
  { href: "/risorse", title: "Risorse", desc: "Link utili e riferimenti rapidi" },
  { href: "/info", title: "Info", desc: "Progetto, note e disclaimer" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Appunti di Pediatria
        </h1>
        <p className="mt-2 text-slate-600">
          Webapp personale di supporto clinico e studio.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}