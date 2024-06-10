import { describe, expect, it } from "vitest";
import { ObjectComparator } from "../../src/comparator/ObjectComparator";

describe("ObjectComparator", () => {
  describe("== operator", () => {
    it("compare returns true for equal objects", () => {
      expect(ObjectComparator["=="]({ a: "foo" }, { a: "foo" })).toBe(true);
    });

    it("compare returns false for different objects", () => {
      expect(ObjectComparator["=="]({ a: "foo" }, { a: "bar" })).toBe(false);
    });

    it("compare returns false for different collection of names", () => {
      expect(ObjectComparator["=="]({ a: "foo", b: "bar" }, { a: "foo" })).toBe(
        false,
      );
    });

    it("compare returns true for equal nested objects", () => {
      expect(
        ObjectComparator["=="]({ a: { b: "foo" } }, { a: { b: "foo" } }),
      ).toBe(true);
    });

    it("compare returns false for different nested objects", () => {
      expect(
        ObjectComparator["=="]({ a: { b: "foo" } }, { a: { b: "bar" } }),
      ).toBe(false);
    });

    it("compare returns false for different object with different type", () => {
      expect(ObjectComparator["=="]({ a: { b: 1 } }, { a: { b: "1" } })).toBe(
        false,
      );
    });
  });

  describe("!= operator", () => {
    it("compare returns false for equal objects", () => {
      expect(ObjectComparator["!="]({ a: "foo" }, { a: "foo" })).toBe(false);
    });
  });

  describe("< operator", () => {
    it("does not defined for objects", () => {
      expect(ObjectComparator["<"]({ a: "foo" }, { a: "foo" })).toBe(false);
    });
  });

  describe("= <operator", () => {
    it("== implies <=", () => {
      expect(ObjectComparator["<="]({ a: "foo" }, { a: "foo" })).toBe(true);
    });
  });

  describe("> operator", () => {
    it("does not defined for objects", () => {
      expect(ObjectComparator[">"]({ a: "foo" }, { a: "foo" })).toBe(false);
    });
  });

  describe(">= operator", () => {
    it("== implies >=", () => {
      expect(ObjectComparator[">="]({ a: "foo" }, { a: "foo" })).toBe(true);
    });
  });
});
