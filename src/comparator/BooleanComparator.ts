import { ComparisonOperators } from "./ComparisonOperators";

export const BooleanComparator: ComparisonOperators<boolean> = {
  ["=="](a, b) {
    return a === b;
  },
  ["!="](a, b) {
    return a !== b;
  },
  ["<"]() {
    return false;
  },
  ["<="](a, b) {
    return a === b;
  },
  [">"]() {
    return false;
  },
  [">="](a, b) {
    return a === b;
  },
};
