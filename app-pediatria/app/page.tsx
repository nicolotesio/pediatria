import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { cardGrid, formInput, pageContainer, pageDescription, pageMain, pageTitle, subtleLink } from "@/components/ui";

const mainSections = [
  { href: "/appunti", title: "Appunti", desc: "Appunti divisi per materia", icon: "📚" },
  { href: "/emergenze", title: "Emergenze", desc: "WETFLAG, dosi rapide, algoritmi", icon: "🚑" },
  { href: "/calcolatori", title: "Calcolatori", desc: "Crescita, farmaci, idratazione", icon: "🧮" },
  { href: "/risorse", title: "Risorse", desc: "Linee guida e link utili", icon: "📖" },
  { href: "/genitori", title: "Genitori", desc: "Info pratiche per le famiglie", icon: "👶" },
  { href: "/info", title: "Informazioni", desc: "Progetto e disclaimer", icon: "ℹ️" },
];

export default function HomePage() {
  return (
    <main className={pageMain}>
      <div className={pageContainer}>

        {/* HEADER */}
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className={pageTitle}>
              Appunti di <span className="text-blue-500">Pediatria</span>
            </h1>

            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-200">
              di Dr Nicolò Tesio
            </p>

            <p className={pageDescription}>
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
            className={`${formInput} w-full rounded-2xl pl-12 text-sm placeholder:text-slate-500 focus:ring-blue-500 dark:placeholder:text-slate-400`}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>

        {/* SEZIONI PRINCIPALI */}
        <div className={cardGrid}>
          {mainSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="flex items-center gap-2 text-2xl font-semibold">
                <span className="text-lg">{section.icon}</span>
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