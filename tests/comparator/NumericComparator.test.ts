import { describe, expect, test as it } from "vitest";
import { NumericComparator } from "../../src/comparator/NumericComparator";

describe("NumericComparator", () => {
	it("== returns true for equal number", () => {
		expect(NumericComparator["=="](1, 1)).toBe(true);
	});

	it("== returns false for different numbers", () => {
		expect(NumericComparator["=="](1, 2)).toBe(false);
	});

	it("!= returns true for different numbers", () => {
		expect(NumericComparator["!="](1, 2)).toBe(true);
	});

	it("!= returns false for equal numbers", () => {
		expect(NumericComparator["!="](1, 1)).toBe(false);
	});

	it("< returns true for a < b", () => {
		expect(NumericComparator["<"](1, 2)).toBe(true);
	});

	it("< returns false for a >= b", () => {
		expect(NumericComparator["<"](2, 1)).toBe(false);
	});

	it("<= returns true for a <= b", () => {
		expect(NumericComparator["<="](1, 1)).toBe(true);
		expect(NumericComparator["<="](1, 2)).toBe(true);
	});

	it("<= returns false for a > b", () => {
		expect(NumericComparator["<="](2, 1)).toBe(false);
	});

	it("> returns true for a > b", () => {
		expect(NumericComparator[">"](2, 1)).toBe(true);
	});

	it("> returns false for a <= b", () => {
		expect(NumericComparator[">"](1, 2)).toBe(false);
	});

	it(">= returns true for a >= b", () => {
		expect(NumericComparator[">="](1, 1)).toBe(true);
		expect(NumericComparator[">="](2, 1)).toBe(true);
	});

	it(">= returns false for a < b", () => {
		expect(NumericComparator[">="](1, 2)).toBe(false);
	});
});
