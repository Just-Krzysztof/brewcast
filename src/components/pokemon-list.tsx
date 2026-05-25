"use client";

import { usePokemonList } from "@/hooks/use-pokemon-list";
import { PokemonCard } from "@/components/pokemon-card";

export function PokemonList() {
  const { data, isLoading, isError, error } = usePokemonList({ limit: 9 });

  if (isLoading) return <p className="text-zinc-500">Ładowanie...</p>;
  if (isError) return <p className="text-red-500">Błąd: {error.message}</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500">
        Łącznie: {data?.count} pokemonów
      </p>
      <ul className="grid grid-cols-3 gap-4">
        {data?.results.map((pokemon) => (
          <li key={pokemon.name}>
            <PokemonCard name={pokemon.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
