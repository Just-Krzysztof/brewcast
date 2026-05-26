"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Nav, type View } from "@/components/nav";
import { TypeFilter } from "@/components/type-filter";
import { PokemonList } from "@/features/pokemon-list";
import { FavoritesView } from "@/components/favorites-view";
import { ComparisonView } from "@/components/comparison-view";

export default function Home() {
  const [view, setView] = useState<View>("all");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const t = useTranslations("page");

  function handleViewChange(next: View) {
    setView(next);
  }

  return (
    <main className="p-4 sm:p-8">
      <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>

      <Nav activeView={view} onChange={handleViewChange} />

      {view === "all" && (
        <>
          <TypeFilter selected={selectedType} onChange={setSelectedType} />
          <PokemonList selectedType={selectedType} />
        </>
      )}

      {view === "favorites" && <FavoritesView />}

      {view === "comparison" && (
        <ComparisonView onGoToAll={() => setView("all")} />
      )}
    </main>
  );
}
