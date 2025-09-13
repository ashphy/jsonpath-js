import type { ComparisonOperators } from "./comparison-operators";

export const NumericComparator: ComparisonOperators<number> = {
	"=="(a, b) {
		return a === b;
	},
	"!="(a, b) {
		return a !== b;
	},
	"<"(a, b) {
		if (typeof b !== "number") return false;
		return a < b;
	},
	"<="(a, b) {
		if (typeof b !== "number") return false;
		return a <= b;
	},
	">"(a, b) {
		if (typeof b !== "number") return false;
		return a > b;
	},
	">="(a, b) {
		if (typeof b !== "number") return false;
		return a >= b;
	},
};
