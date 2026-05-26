"use client";

import { useTranslations, useMessages } from "next-intl";
import { usePokemonBasic } from "@/hooks/use-pokemon-basic";
import { useFavoritesStore } from "@/store/favorites";
import { useComparisonStore } from "@/store/comparison";
import { Zap, ZapOff } from "lucide-react";
import { getTypeGradient } from "@/lib/pokemon-types";

interface PokemonCardProps {
  name: string;
  onDetails?: (name: string) => void;
}

export function PokemonCard({ name, onDetails }: PokemonCardProps) {
  const t = useTranslations("pokemonCard");
  const messages = useMessages();
  const rawTypes = messages.types as Record<string, string> | undefined;
  const typeName = (type: string) => rawTypes?.[type] ?? type;

  const { data, isLoading, isError } = usePokemonBasic(name);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(name));
  const toggleComparison = useComparisonStore((s) => s.toggleComparison);
  const isInComparison = useComparisonStore((s) => s.isInComparison(name));

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border bg-zinc-50 dark:bg-zinc-900">
        <span className="text-sm text-zinc-400">{t("loading")}</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-red-200 bg-red-50">
        <span className="text-sm text-red-400">{t("error")}</span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-2 rounded-lg border p-4 hover:shadow-md transition-shadow">
      <button
        onClick={() => toggleFavorite(name)}
        aria-label={isFavorite ? t("removeFromFavorites") : t("addToFavorites")}
        className="absolute top-2 right-2 text-lg leading-none cursor-pointer"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
      <button
        onClick={() => toggleComparison(name)}
        aria-label={isInComparison ? t("removeFromComparison") : t("addToComparison")}
        className="absolute top-2 right-10 text-lg leading-none cursor-pointer"
      >
        {isInComparison ? <ZapOff /> : <Zap />}
      </button>
      {data.spriteUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.spriteUrl} alt={data.name} width={96} height={96} />
      )}
      <p className="text-xs text-zinc-400">#{data.id}</p>
      <p className="font-semibold capitalize">{data.name}</p>
      <div className="flex gap-1">
        {data.types.map((type) => (
          <span
            key={type}
            className={`rounded-full px-2 py-0.5 text-xs text-black font-bold ${getTypeGradient(type)}`}
          >
            {typeName(type)}
          </span>
        ))}
      </div>
      {onDetails && (
        <button
          onClick={() => onDetails(data.name)}
          className="mt-1 text-xs text-blue-500 hover:underline cursor-pointer"
        >
          {t("details")}
        </button>
      )}
    </div>
  );
}
