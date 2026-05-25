"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPokemonBasic } from "@/lib/pokemon-api";

export function usePokemonBasic(nameOrId: string | number) {
  return useQuery({
    queryKey: ["pokemon", nameOrId],
    queryFn: () => fetchPokemonBasic(nameOrId),
  });
}
