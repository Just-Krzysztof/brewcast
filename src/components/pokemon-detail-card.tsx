"use client";

import { useTranslations, useMessages } from "next-intl";
import { usePokemonDetails } from "@/hooks/use-pokemon-details";
import { getTypeGradient } from "@/lib/pokemon-types";

interface PokemonDetailCardProps {
  name: string;
}

export function PokemonDetailCard({ name }: PokemonDetailCardProps) {
  const t = useTranslations("pokemonDetail");
  const messages = useMessages();
  const rawTypes = messages.types as Record<string, string> | undefined;
  const typeName = (type: string) => rawTypes?.[type] ?? type;

  const { data, isLoading, isError } = usePokemonDetails(name);

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border bg-zinc-50 dark:bg-zinc-900">
        <span className="text-sm text-zinc-400">{t("loading")}</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-red-200 bg-red-50">
        <span className="text-sm text-red-400">{t("error")}</span>
      </div>
    );
  }

  const STAT_LABELS: Record<string, string> = {
    hp: t("statHp"),
    attack: t("statAttack"),
    defense: t("statDefense"),
    "special-attack": t("statSpecialAttack"),
    "special-defense": t("statSpecialDefense"),
    speed: t("statSpeed"),
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border p-6">
      {data.spriteUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.spriteUrl} alt={data.name} width={120} height={120} />
      )}
      <p className="text-xs text-zinc-400">#{data.id}</p>
      <p className="text-xl font-bold capitalize">{data.name}</p>

      <div className="flex gap-1">
        {data.types.map((type) => (
          <span
            key={type}
            className={`rounded-full px-2.5 py-0.5 text-xs text-white ${getTypeGradient(type)}`}
          >
            {typeName(type)}
          </span>
        ))}
      </div>

      <div className="w-full text-sm text-zinc-500 flex justify-center gap-6">
        <span>
          {t("weight")}:{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">
            {(data.weight / 10).toFixed(1)} kg
          </strong>
        </span>
        <span>
          {t("height")}:{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">
            {(data.height / 10).toFixed(1)} m
          </strong>
        </span>
      </div>

      {data.abilities.length > 0 && (
        <p className="text-xs text-zinc-500 capitalize">
          {t("abilities")}: {data.abilities.join(", ")}
        </p>
      )}

      <div className="w-full space-y-1.5 mt-1">
        {data.stats.map((stat) => (
          <div key={stat.name} className="flex items-center gap-2 text-xs">
            <span className="w-24 shrink-0 text-right text-zinc-500">
              {STAT_LABELS[stat.name] ?? stat.name}
            </span>
            <span className="w-8 shrink-0 font-mono font-semibold">
              {stat.value}
            </span>
            <div className="flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800 h-2">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
