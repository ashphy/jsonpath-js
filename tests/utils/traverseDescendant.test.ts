import { describe, expect, test } from "vitest";
import { traverseDescendant } from "../../src/utils/traverseDescendant";

describe("traverseDescendant", () => {
  test("empty object traverses empty", () => {
    const json = {};
    expect(traverseDescendant(json)).toEqual([{}]);
  });

  test("empty object traverses empty", () => {
    const json = [[[1]], [2]];
    expect(traverseDescendant(json)).toEqual([
      [[[1]], [2]],
      [[1]],
      [1],
      1,
      [2],
      2,
    ]);
  });
});
