import { describe, expect, it } from "vitest";
import { ArrayComparator } from "../../src/comparator/ArrayComparator";

describe("ArrayComparator", () => {
  describe("== operator", () => {
    it("compare returns true for equal arrays", () => {
      expect(ArrayComparator["=="]([1], [1])).toBe(true);
    });

    it("compare returns false for different arrays", () => {
      expect(ArrayComparator["=="]([1], [2])).toBe(false);
    });

    it("compare returns false for different collections", () => {
      expect(ArrayComparator["=="]([1, 2], [1])).toBe(false);
    });

    it("compare returns true for equal nested objects", () => {
      expect(ArrayComparator["=="]([1, [2]], [1, [2]])).toBe(true);
    });

    it("compare returns true for different nested objects", () => {
      expect(ArrayComparator["=="]([1, [2]], [1, [3]])).toBe(false);
    });

    it("compare returns false for different object with different type", () => {
      expect(ArrayComparator["=="]([1, 2], [1, "2"])).toBe(false);
    });
  });

  describe("!= operator", () => {
    it("compare returns false for equal objects", () => {
      expect(ArrayComparator["!="]([1], [1])).toBe(false);
    });
  });

  describe("< operator", () => {
    it("does not defined for objects", () => {
      expect(ArrayComparator["<"]([1], [1])).toBe(false);
    });
  });

  describe("<= operator", () => {
    it("== implies <=", () => {
      expect(ArrayComparator["<="]([1], [1])).toBe(true);
    });
  });

  describe("> operator", () => {
    it("does not defined for objects", () => {
      expect(ArrayComparator[">"]([1], [1])).toBe(false);
    });
  });

  describe(">= operator", () => {
    it("== implies >=", () => {
      expect(ArrayComparator[">="]([1], [1])).toBe(true);
    });
  });
});
