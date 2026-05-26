# PokeFinder — Find your Pokémon

Aplikacja do przeglądania, filtrowania i porównywania Pokémonów, zbudowana na Next.js z wykorzystaniem publicznego [PokeAPI](https://pokeapi.co).

## Funkcje

- Przeglądanie listy Pokémonów z paginacją
- Filtrowanie po typie
- Szczegóły Pokémona — statystyki, zdolności, waga, wzrost
- Ulubione — persystowane w `localStorage`
- Porównywanie dwóch Pokémonów obok siebie
- Wielojęzyczność (polski / angielski)

## Stack

| Warstwa | Technologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Pobieranie danych | TanStack Query v5 |
| Stan globalny | Zustand v5 (z persystencją) |
| Internacjonalizacja | next-intl |
| Testy | Vitest + Testing Library |
| Język | TypeScript |

## Uruchomienie

Projekt używa **pnpm** — menedżera pakietów szybszego od npm/yarn dzięki równoległemu pobieraniu i twardym linkom do globalnego store (każda paczka raz na dysku, niezależnie od liczby projektów). Zapewnia też ścisłą izolację zależności, eliminując dostęp do paczek spoza `package.json`.

Instalacja zależności i start serwera deweloperskiego:

```bash
pnpm install
pnpm dev
```

Aplikacja dostępna pod [http://localhost:3000](http://localhost:3000).

### Inne komendy

```bash
pnpm build        # build produkcyjny
pnpm start        # uruchomienie builda produkcyjnego
pnpm lint         # linting
pnpm test         # testy w trybie watch
pnpm test:run     # testy jednorazowo (CI)
```

## Struktura projektu

```
src/
├── app/          # strony Next.js (App Router, routing po locale)
├── components/   # komponenty UI
├── features/     # komponenty widoku pogrupowane według funkcjonalności (np. lista Pokémonów)
├── hooks/        # hooki React Query do pobierania danych z PokeAPI
├── store/        # store Zustand (ulubione, porównywanie)
├── i18n/         # konfiguracja i akcje next-intl
├── messages/     # tłumaczenia (en.ts, pl.ts)
├── lib/          # funkcje do komunikacji z PokeAPI
└── types/        # typy TypeScript
```

## Autor

Krzysztof Just
