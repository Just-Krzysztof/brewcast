"use client";

import { usePokemonBasic } from "@/hooks/use-pokemon-basic";

interface PokemonCardProps {
  name: string;
  onDetails?: (name: string) => void;
}

export function PokemonCard({ name, onDetails }: PokemonCardProps) {
  const { data, isLoading, isError } = usePokemonBasic(name);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border bg-zinc-50 dark:bg-zinc-900">
        <span className="text-sm text-zinc-400">Ładowanie...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-red-200 bg-red-50">
        <span className="text-sm text-red-400">Błąd</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:shadow-md transition-shadow">
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
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs capitalize dark:bg-zinc-800"
          >
            {type}
          </span>
        ))}
      </div>
      {onDetails && (
        <button
          onClick={() => onDetails(data.name)}
          className="mt-1 text-xs text-blue-500 hover:underline"
        >
          Details
        </button>
      )}
    </div>
  );
}
