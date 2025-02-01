import type { Operators } from "./Operators";

export type Comparator<T> = (a: T, b: T) => boolean;

export type ComparisonOperators<T> = {
	[key in Operators]: Comparator<T>;
};
