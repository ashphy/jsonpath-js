import { describe, expect, it } from "vitest";
import { StringComparator } from "../../src/comparator/StringComparator";

describe("StringComparator", () => {
  it("== returns true for equal strings", () => {
    expect(StringComparator["=="]("hello", "hello")).toBe(true);
  });

  it("== returns false for different strings", () => {
    expect(StringComparator["=="]("hello", "world")).toBe(false);
  });

  it("!= returns true for different strings", () => {
    expect(StringComparator["!="]("hello", "world")).toBe(true);
  });

  it("!= returns false for equal strings", () => {
    expect(StringComparator["!="]("hello", "hello")).toBe(false);
  });

  it("< returns true for a < b", () => {
    expect(StringComparator["<"]("a", "b")).toBe(true);
  });

  it("< returns false for a >= b", () => {
    expect(StringComparator["<"]("b", "a")).toBe(false);
  });

  it("<= returns true for a <= b", () => {
    expect(StringComparator["<="]("a", "b")).toBe(true);
    expect(StringComparator["<="]("a", "a")).toBe(true);
  });

  it("<= returns false for a > b", () => {
    expect(StringComparator["<="]("b", "a")).toBe(false);
  });

  it("> returns true for a > b", () => {
    expect(StringComparator[">"]("b", "a")).toBe(true);
  });

  it("> returns false for a <= b", () => {
    expect(StringComparator[">"]("a", "b")).toBe(false);
  });

  it(">= returns true for a >= b", () => {
    expect(StringComparator[">="]("b", "a")).toBe(true);
    expect(StringComparator[">="]("a", "a")).toBe(true);
  });

  it(">= returns false for a < b", () => {
    expect(StringComparator[">="]("a", "b")).toBe(false);
  });
});
