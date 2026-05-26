"use client";

import { useTranslations } from "next-intl";
import { useFavoritesStore } from "@/store/favorites";
import { PokemonCard } from "@/components/pokemon-card";

export function FavoritesView() {
  const t = useTranslations("favorites");
  const favorites = useFavoritesStore((s) => s.favorites);

  if (favorites.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">{t("empty")}</p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((name) => (
        <li key={name}>
          <PokemonCard name={name} />
        </li>
      ))}
    </ul>
  );
}
