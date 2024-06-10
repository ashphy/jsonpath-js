import { Operators } from "./Operators";

export interface Comparator<T> {
  (a: T, b: T): boolean;
}

export type ComparisonOperators<T> = {
  [key in Operators]: Comparator<T>;
};
