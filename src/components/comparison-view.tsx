"use client";

import { useTranslations } from "next-intl";
import { useComparisonStore } from "@/store/comparison";
import { PokemonDetailCard } from "@/components/pokemon-detail-card";

interface ComparisonViewProps {
  onGoToAll: () => void;
}

export function ComparisonView({ onGoToAll }: ComparisonViewProps) {
  const t = useTranslations("comparison");
  const comparison = useComparisonStore((s) => s.comparison);
  const toggleComparison = useComparisonStore((s) => s.toggleComparison);

  if (comparison.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-zinc-500">
        <p className="text-sm">{t("empty")}</p>
        <button
          onClick={onGoToAll}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
        >
          {t("selectPokemon")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {comparison.map((name) => (
        <div key={name} className="relative">
          <button
            onClick={() => toggleComparison(name)}
            aria-label={t("removePokemon", { name })}
            className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-700 dark:text-zinc-300 cursor-pointer text-xs font-bold"
          >
            ✕
          </button>
          <PokemonDetailCard name={name} />
        </div>
      ))}
      {comparison.length === 1 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-zinc-400">
          <p className="text-sm">{t("missingSecond")}</p>
          <button
            onClick={onGoToAll}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer text-zinc-500"
          >
            {t("selectPokemon")}
          </button>
        </div>
      )}
    </div>
  );
}
