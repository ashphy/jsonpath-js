import { describe, expect, it } from "vitest";
import { BooleanComparator } from "../../src/comparator/BooleanComparator";

describe("StringComparator", () => {
  it("== returns true for equal booleans", () => {
    expect(BooleanComparator["=="](true, true)).toBe(true);
  });

  it("== returns true for equal booleans", () => {
    expect(BooleanComparator["=="](false, false)).toBe(true);
  });

  it("== returns false for different booleans", () => {
    expect(BooleanComparator["=="](true, false)).toBe(false);
  });

  it("Booleans do not offer < comparison", () => {
    expect(BooleanComparator["<"](true, true)).toBe(false);
    expect(BooleanComparator["<="](true, true)).toBe(true);
    expect(BooleanComparator[">"](true, true)).toBe(false);
    expect(BooleanComparator[">="](true, true)).toBe(true);
  });
});
