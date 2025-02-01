/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test } from "vitest";
import { isEqual } from "../../src/utils/isEqual";

describe("isEqual", () => {
  test("should return true for equal primitive values", () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1.2, 1.2)).toBe(true);
    expect(isEqual("a", "a")).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
  });

  test("should return false for different primitive values", () => {
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual(1.2, 2.1)).toBe(false);
    expect(isEqual("a", "b")).toBe(false);
    expect(isEqual(true, false)).toBe(false);
    expect(isEqual(null, 1)).toBe(false);
  });

  test("should return true for equal arrays", () => {
    expect(isEqual([], [])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2, [3, 4]], [1, 2, [3, 4]])).toBe(true);
  });

  test("should return false for different arrays", () => {
    expect(isEqual([], [1])).toBe(false);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, 2, [3, 4]], [1, 2, [3, 5]])).toBe(false);
  });

  test("should return true for equal objects", () => {
    expect(isEqual({}, {})).toBe(true);
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  test("should return true for nested equal objects", () => {
    expect(isEqual({ a: 1, b: { c: "2" } }, { a: 1, b: { c: "2" } })).toBe(
      true,
    );
  });

  test("should return false for different objects", () => {
    expect(isEqual({}, { a: 1 })).toBe(false);
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });

  test("should return true for object that has circular dependency", () => {
    const a: any = { foo: "bar" };
    const b: any = { foo: "bar" };

    a.self = a;
    b.self = b;

    expect(isEqual(a, b)).toBe(true);
  });

  test("should return false for different object that has circular dependency", () => {
    const aChild: any = { baz: "qux" };
    const bChild: any = { baz: "quux" };

    aChild.self = aChild;
    bChild.self = bChild;

    const a = { foo: "bar", child: aChild };
    const b = { foo: "bar", child: bChild };

    expect(isEqual(a, b)).toBe(false);
  });
});
