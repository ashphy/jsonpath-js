import { evalCompare } from "../src/parsers/filter_selector";
import { Nothing } from "../src/types/nothing";
import { describe, it, expect } from "vitest";

describe("2.3.5.2.2. Comparisons", () => {
  describe("2.3.5.3. Examples", () => {
    const obj = { json: { x: "y" } };
    const array = { json: [2, 3] };

    it("Empty nodelists", () => {
      expect(evalCompare(Nothing, Nothing, "==")).toBe(true);
    });

    it("== implies <=", () => {
      expect(evalCompare(Nothing, Nothing, "<=")).toBe(true);
    });

    it("Empty nodelist", () => {
      expect(evalCompare(Nothing, { json: "g" }, "==")).toBe(false);
    });

    it("Empty nodelists", () => {
      expect(evalCompare(Nothing, Nothing, "!=")).toBe(false);
    });

    it("Empty nodelist", () => {
      expect(evalCompare(Nothing, { json: "g" }, "!=")).toBe(true);
    });

    it("Numeric comparison", () => {
      expect(evalCompare(1, 2, "<=")).toBe(true);
    });

    it("Strict, numeric comparison", () => {
      expect(evalCompare(1, 2, ">")).toBe(false);
    });

    it("Type mismatch", () => {
      expect(evalCompare(13, "13", "==")).toBe(false);
    });

    it("String comparison", () => {
      expect(evalCompare("a", "b", "<=")).toBe(true);
    });

    it("Strict, string comparison", () => {
      expect(evalCompare("a", "b", ">")).toBe(false);
    });

    it("Type mismatch", () => {
      expect(evalCompare(obj, array, "==")).toBe(false);
    });

    it("Type mismatch", () => {
      expect(evalCompare(obj, array, "!=")).toBe(true);
    });

    it("Object comparison", () => {
      expect(evalCompare(obj, obj, "==")).toBe(true);
    });

    it("Object comparison", () => {
      expect(evalCompare(obj, obj, "!=")).toBe(false);
    });

    it("Array comparison", () => {
      expect(evalCompare(array, array, "==")).toBe(true);
    });

    it("Array comparison", () => {
      expect(evalCompare(array, array, "!=")).toBe(false);
    });

    it("Type mismatch", () => {
      expect(evalCompare(obj, 17, "==")).toBe(false);
    });

    it("Type mismatch", () => {
      expect(evalCompare(obj, 17, "!=")).toBe(true);
    });

    it("Objects and arrays do not offer < comparison", () => {
      expect(evalCompare(obj, array, "<=")).toBe(false);
    });

    it("Objects and arrays do not offer < comparison", () => {
      expect(evalCompare(obj, array, "<")).toBe(false);
    });

    it("== implies <=", () => {
      expect(evalCompare(obj, obj, "<=")).toBe(true);
    });

    it("== implies <=", () => {
      expect(evalCompare(array, array, "<=")).toBe(true);
    });

    it("Arrays do not offer < comparison", () => {
      expect(evalCompare(1, array, "<=")).toBe(false);
    });

    it("Arrays do not offer < comparison", () => {
      expect(evalCompare(1, array, ">=")).toBe(false);
    });

    it("Arrays do not offer < comparison", () => {
      expect(evalCompare(1, array, ">")).toBe(false);
    });

    it("Arrays do not offer < comparison", () => {
      expect(evalCompare(1, array, "<")).toBe(false);
    });

    it("== implies <=", () => {
      expect(evalCompare(true, true, "<=")).toBe(true);
    });

    it("Booleans do not offer < comparison", () => {
      expect(evalCompare(true, true, ">")).toBe(false);
    });
  });
});
