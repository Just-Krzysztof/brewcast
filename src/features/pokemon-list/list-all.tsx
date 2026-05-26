"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { usePokemonList } from "@/hooks/use-pokemon-list";
import { fetchPokemonList, fetchPokemonBasic } from "@/lib/pokemon-api";
import { PokemonCard } from "@/components/pokemon-card";
import { Pagination } from "./pagination";
import type { PokemonListResponse } from "@/types/pokemon";

const LIMIT = 9;
const PREFETCH_RADIUS = 2;

export function PokemonListAll() {
  const t = useTranslations("list");
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching } = usePokemonList(
    { limit: LIMIT, offset },
    { placeholderData: keepPreviousData },
  );

  const totalPages = data ? Math.ceil(data.count / LIMIT) : null;

  useEffect(() => {
    if (!totalPages) return;

    async function prefetchPage(pageNum: number) {
      const params = { limit: LIMIT, offset: (pageNum - 1) * LIMIT };
      await queryClient.prefetchQuery({
        queryKey: ["pokemon-list", params],
        queryFn: () => fetchPokemonList(params),
      });
      const listData = queryClient.getQueryData<PokemonListResponse>([
        "pokemon-list",
        params,
      ]);
      if (!listData) return;
      await Promise.all(
        listData.results.map((pokemon) =>
          queryClient.prefetchQuery({
            queryKey: ["pokemon", pokemon.name],
            queryFn: () => fetchPokemonBasic(pokemon.name),
          }),
        ),
      );
    }

    for (let delta = -PREFETCH_RADIUS; delta <= PREFETCH_RADIUS; delta++) {
      if (delta === 0) continue;
      const target = page + delta;
      if (target < 1 || target > totalPages) continue;
      void prefetchPage(target);
    }

    const cachedLists = queryClient.getQueriesData<PokemonListResponse>({
      queryKey: ["pokemon-list"],
    });
    for (const [queryKey, listData] of cachedLists) {
      const params = queryKey[1] as
        | { limit?: number; offset?: number }
        | undefined;
      if (!params || typeof params.offset !== "number") continue;
      const cachedPage = Math.floor(params.offset / LIMIT) + 1;
      if (Math.abs(cachedPage - page) > PREFETCH_RADIUS) {
        listData?.results.forEach((pokemon) => {
          queryClient.removeQueries({
            queryKey: ["pokemon", pokemon.name],
            exact: true,
          });
        });
        queryClient.removeQueries({ queryKey, exact: true });
      }
    }
  }, [page, totalPages, queryClient]);

  if (isLoading) return <p className="text-zinc-500">{t("loading")}</p>;
  if (isError) return <p className="text-red-500">{t("error", { message: error.message })}</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500">{t("total", { count: data?.count ?? 0 })}</p>
      <ul className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isFetching ? "opacity-60" : ""}`}>
        {data?.results.map((pokemon) => (
          <li key={pokemon.name}>
            <PokemonCard name={pokemon.name} />
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
