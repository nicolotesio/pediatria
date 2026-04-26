"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { formInput } from "@/components/ui";
import { searchContent, type SearchResult } from "@/lib/search";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calcola i risultati della ricerca (memoizzato per performance)
  const results: SearchResult[] = useMemo(() => {
    return searchContent(query);
  }, [query]);

  // Gestisce il click fuori dal dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gestisce la navigazione con tastiera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;

        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            window.location.href = results[selectedIndex].route;
          }
          break;

        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;

        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, selectedIndex, results]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className="relative mt-8">
      {/* SEARCH INPUT */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Cerca: bronchiolite, febbre, paracetamolo, adrenalina..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`${formInput} w-full rounded-2xl pl-12 text-sm placeholder:text-slate-500 focus:ring-blue-500 dark:placeholder:text-slate-400`}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
      </div>

      {/* DROPDOWN RESULTS */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
          {results.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.map((result, idx) => (
                <Link
                  key={result.id}
                  href={result.route}
                  className={`block px-4 py-3 transition ${
                    selectedIndex === idx
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                  }}
                >
                  {/* HEADER: Icon + Title */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{result.icon}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {result.title}
                    </span>
                    <span className="ml-auto text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {result.category}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {result.description}
                  </p>

                  {/* MATCH INFO */}
                  {query.trim() && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                      Match:{" "}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {result.matchType}
                      </span>
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="px-4 py-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                Nessun risultato trovato per{" "}
                <span className="font-semibold">"{query}"</span>
              </p>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                Prova a cercare: adrenalina, centili, peso, WETFLAG...
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* HINT: Mostra quando il dropdown è aperto ma non ci sono risultati o è vuoto */}
      {isOpen && results.length === 0 && !query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            💡 Suggerimenti: Prova a cercare "adrenalina", "centili", "peso",
            "WETFLAG", "farmaci"...
          </p>
        </div>
      )}
    </div>
  );
}
