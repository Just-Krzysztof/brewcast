"use client";

import { useState, useEffect } from "react";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { usePokemonList } from "@/hooks/use-pokemon-list";
import { fetchPokemonList, fetchPokemonBasic } from "@/lib/pokemon-api";
import { PokemonCard } from "@/components/pokemon-card";
import type { PokemonListResponse } from "@/types/pokemon";

const LIMIT = 9;
const PREFETCH_RADIUS = 2;

export function PokemonList() {
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

    // czyszczenie danych ktore są dlaej niż 2 w przod i 2 w tył
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

  if (isLoading) return <p className="text-zinc-500">Ładowanie...</p>;
  if (isError) return <p className="text-red-500">Błąd: {error.message}</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500">
        Łącznie: {data?.count} pokemonów
      </p>

      <ul
        className={`grid grid-cols-3 gap-4 ${isFetching ? "opacity-60" : ""}`}
      >
        {data?.results.map((pokemon) => (
          <li key={pokemon.name}>
            <PokemonCard name={pokemon.name} />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          prev
        </button>

        <span className="text-sm text-zinc-500">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          next
        </button>
      </div>
    </div>
  );
}
