import type { JsonArray } from "../types/json";
import { isEqual } from "../utils/isEqual";
import type { ComparisonOperators } from "./ComparisonOperators";

// equal arrays, that is, arrays of the same length where each element of
// the first array is equal to the corresponding element of the second array, or
export const ArrayComparator: ComparisonOperators<JsonArray> = {
	"=="(a, b) {
		return isEqual(a, b);
	},
	"!="(a, b) {
		return !isEqual(a, b);
	},
	"<"() {
		// Not defined
		return false;
	},
	"<="(a, b) {
		return isEqual(a, b);
	},
	">"() {
		// Not defined
		return false;
	},
	">="(a, b) {
		return isEqual(a, b);
	},
};
