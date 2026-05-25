import type {
  PokemonApiResponse,
  PokemonBasic,
  PokemonListParams,
  PokemonListResponse,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList({
  limit = 9,
  offset = 0,
}: PokemonListParams = {}): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status}`);
  }

  return response.json() as Promise<PokemonListResponse>;
}

export async function fetchPokemonBasic(
  nameOrId: string | number
): Promise<PokemonBasic> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);

  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status}`);
  }

  const data = (await response.json()) as PokemonApiResponse;

  return {
    id: data.id,
    name: data.name,
    spriteUrl: data.sprites.front_default,
    types: data.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name),
  };
}

export function getPokemonIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) throw new Error(`Cannot parse ID from URL: ${url}`);
  return Number(match[1]);
}
