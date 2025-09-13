import type { ComparisonOperators } from "./comparison-operators";

export const NullComparator: ComparisonOperators<null> = {
	"=="(a, b) {
		return a === b;
	},
	"!="(a, b) {
		return a !== b;
	},
	"<"() {
		return false;
	},
	"<="(a, b) {
		return a === b;
	},
	">"() {
		return false;
	},
	">="(a, b) {
		return a === b;
	},
};
