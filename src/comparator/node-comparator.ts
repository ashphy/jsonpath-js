import type { Json } from "../types/json";
import { Nothing } from "../types/nothing";
import type { ComparisonOperators } from "./ComparisonOperators";

// When either side of a comparison results in an empty nodelist or the special result Nothing
// - A comparison using the operator == yields true if and only the other side also results
//   in an empty nodelist or the special result Nothing.
// - A comparison using the operator < yields false.
export const NodeComparator: ComparisonOperators<Json | Nothing> = {
	"=="(a, b) {
		return (a === Nothing || b === Nothing) && a === b;
	},
	"!="(a, b) {
		return (a === Nothing || b === Nothing) && a !== b;
	},
	"<"() {
		// Not defined
		return false;
	},
	"<="(a, b) {
		return (a === Nothing || b === Nothing) && a === b;
	},
	">"() {
		// Not defined
		return false;
	},
	">="(a, b) {
		return (a === Nothing || b === Nothing) && a === b;
	},
};
