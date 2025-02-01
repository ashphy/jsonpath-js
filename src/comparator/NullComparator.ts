import type { ComparisonOperators } from "./ComparisonOperators";

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
