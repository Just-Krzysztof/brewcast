import { describe, it, expect, beforeEach, vi } from "vitest";
import { useComparisonStore } from "./comparison";

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

import { toast } from "sonner";

beforeEach(() => {
  useComparisonStore.setState({ comparison: [] });
  vi.clearAllMocks();
});

describe("useComparisonStore", () => {
  it("starts with empty comparison", () => {
    expect(useComparisonStore.getState().comparison).toEqual([]);
  });

  it("adds a pokemon to comparison", () => {
    useComparisonStore.getState().toggleComparison("pikachu");
    expect(useComparisonStore.getState().comparison).toContain("pikachu");
  });

  it("removes a pokemon that is already in comparison", () => {
    useComparisonStore.getState().toggleComparison("pikachu");
    useComparisonStore.getState().toggleComparison("pikachu");
    expect(useComparisonStore.getState().comparison).not.toContain("pikachu");
  });

  it("isInComparison returns true for added pokemon", () => {
    useComparisonStore.getState().toggleComparison("bulbasaur");
    expect(useComparisonStore.getState().isInComparison("bulbasaur")).toBe(true);
  });

  it("isInComparison returns false for pokemon not in comparison", () => {
    expect(useComparisonStore.getState().isInComparison("mewtwo")).toBe(false);
  });

  it("blocks adding a 3rd pokemon and shows toast", () => {
    useComparisonStore.getState().toggleComparison("bulbasaur");
    useComparisonStore.getState().toggleComparison("charmander");
    useComparisonStore.getState().toggleComparison("squirtle");

    expect(useComparisonStore.getState().comparison).toHaveLength(2);
    expect(useComparisonStore.getState().comparison).not.toContain("squirtle");
    expect(toast.error).toHaveBeenCalledOnce();
  });

  it("allows adding again after removing one", () => {
    useComparisonStore.getState().toggleComparison("bulbasaur");
    useComparisonStore.getState().toggleComparison("charmander");
    useComparisonStore.getState().toggleComparison("bulbasaur");
    useComparisonStore.getState().toggleComparison("squirtle");

    expect(useComparisonStore.getState().comparison).toContain("squirtle");
    expect(useComparisonStore.getState().comparison).toHaveLength(2);
  });
});
