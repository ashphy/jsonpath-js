import { JsonObject } from "../types/json";
import { isEqual } from "../utils/isEqual";
import { ComparisonOperators } from "./ComparisonOperators";

// equal objects with no duplicate names, that is, where:
// both objects have the same collection of names (with no duplicates) and
// for each of those names, the values associated with the name by the objects are equal.
export const ObjectComparator: ComparisonOperators<JsonObject> = {
  ["=="](a, b) {
    return isEqual(a, b);
  },
  ["!="](a, b) {
    return !isEqual(a, b);
  },
  ["<"]() {
    // Not defined
    return false;
  },
  ["<="](a, b) {
    return isEqual(a, b);
  },
  [">"]() {
    // Not defined
    return false;
  },
  [">="](a, b) {
    return isEqual(a, b);
  },
};
