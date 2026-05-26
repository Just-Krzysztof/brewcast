"use client";

import { useTranslations, useMessages } from "next-intl";
import { usePokemonTypes } from "@/hooks/use-pokemon-types";
import { getTypeGradient } from "@/lib/pokemon-types";

interface TypeFilterProps {
  selected: string | null;
  onChange: (type: string | null) => void;
}

export function TypeFilter({ selected, onChange }: TypeFilterProps) {
  const t = useTranslations("typeFilter");
  const messages = useMessages();
  const rawTypes = messages.types as Record<string, string> | undefined;
  const typeName = (type: string) => rawTypes?.[type] ?? type;
  const { data: types, isLoading } = usePokemonTypes();

  if (isLoading) {
    return (
      <div className="h-9 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 mb-6">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
          selected === null
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
        }`}
      >
        {t("all")}
      </button>
      {types?.map((type) => (
        <button
          key={type.name}
          onClick={() => onChange(selected === type.name ? null : type.name)}
          className={`rounded-full px-3 py-1 text-xs transition-all cursor-pointer text-black font-bold ${getTypeGradient(type.name)} ${
            selected === type.name
              ? "ring-2 ring-offset-1 ring-current opacity-100"
              : "opacity-70 hover:opacity-100"
          }`}
        >
          {typeName(type.name)}
        </button>
      ))}
    </div>
  );
}
