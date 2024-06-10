import { ComparisonOperators } from "./ComparisonOperators";

// a non-empty string compares less than another non-empty string
// if and only if the first string starts with a lower Unicode scalar
// value than the second string or if both strings start with the same
// Unicode scalar value and the remainder of the first string compares
// less than the remainder of the second string.
export const StringComparator: ComparisonOperators<string> = {
  ["=="](a, b) {
    return a === b;
  },
  ["!="](a, b) {
    return a !== b;
  },
  ["<"](a, b) {
    return a < b;
  },
  ["<="](a, b) {
    return a <= b;
  },
  [">"](a, b) {
    return a > b;
  },
  [">="](a, b) {
    return a >= b;
  },
};
