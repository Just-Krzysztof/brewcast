"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { usePokemonByType } from "@/hooks/use-pokemon-by-type";
import { fetchPokemonBasic } from "@/lib/pokemon-api";
import { PokemonCard } from "@/components/pokemon-card";
import { Pagination } from "./pagination";

const LIMIT = 9;
const PREFETCH_RADIUS = 2;

interface PokemonListByTypeProps {
  typeName: string;
}

export function PokemonListByType({ typeName }: PokemonListByTypeProps) {
  const t = useTranslations("list");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { data: allNames, isLoading, isError } = usePokemonByType(typeName);

  const totalPages = allNames ? Math.ceil(allNames.length / LIMIT) : null;
  const pageNames = allNames ? allNames.slice((page - 1) * LIMIT, page * LIMIT) : [];

  useEffect(() => {
    if (!allNames || !totalPages) return;

    for (let delta = -PREFETCH_RADIUS; delta <= PREFETCH_RADIUS; delta++) {
      if (delta === 0) continue;
      const target = page + delta;
      if (target < 1 || target > totalPages) continue;
      const names = allNames.slice((target - 1) * LIMIT, target * LIMIT);
      names.forEach((name) => {
        void queryClient.prefetchQuery({
          queryKey: ["pokemon", name],
          queryFn: () => fetchPokemonBasic(name),
        });
      });
    }
  }, [page, totalPages, allNames, queryClient]);

  if (isLoading) return <p className="text-zinc-500">{t("loading")}</p>;
  if (isError) return <p className="text-red-500">{t("typeError")}</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500">
        {t("typeTotal", { count: allNames?.length ?? 0, type: typeName })}
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageNames.map((name) => (
          <li key={name}>
            <PokemonCard name={name} />
          </li>
        ))}
      </ul>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
