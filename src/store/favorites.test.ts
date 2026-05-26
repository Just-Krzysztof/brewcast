import { describe, it, expect, beforeEach } from "vitest";
import { useFavoritesStore } from "./favorites";

beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] });
});

describe("useFavoritesStore", () => {
  it("starts with empty favorites", () => {
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });

  it("adds a pokemon to favorites", () => {
    useFavoritesStore.getState().toggleFavorite("pikachu");
    expect(useFavoritesStore.getState().favorites).toContain("pikachu");
  });

  it("removes a pokemon that is already a favorite", () => {
    useFavoritesStore.getState().toggleFavorite("pikachu");
    useFavoritesStore.getState().toggleFavorite("pikachu");
    expect(useFavoritesStore.getState().favorites).not.toContain("pikachu");
  });

  it("isFavorite returns true for added pokemon", () => {
    useFavoritesStore.getState().toggleFavorite("bulbasaur");
    expect(useFavoritesStore.getState().isFavorite("bulbasaur")).toBe(true);
  });

  it("isFavorite returns false for pokemon not in favorites", () => {
    expect(useFavoritesStore.getState().isFavorite("mewtwo")).toBe(false);
  });

  it("can hold multiple favorites independently", () => {
    useFavoritesStore.getState().toggleFavorite("pikachu");
    useFavoritesStore.getState().toggleFavorite("charmander");
    useFavoritesStore.getState().toggleFavorite("pikachu");

    const { favorites } = useFavoritesStore.getState();
    expect(favorites).not.toContain("pikachu");
    expect(favorites).toContain("charmander");
  });
});
