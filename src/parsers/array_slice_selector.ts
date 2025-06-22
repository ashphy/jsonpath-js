import type { SliceSelector } from "../grammar/ast";
import { addIndexPath, type Node, type NodeList } from "../types/node";

// 2.3.4. Array Slice Selector
// The array slice selector has the form <start>:<end>:<step>.
// It matches elements from arrays starting at index < start >
// and ending at(but not including)<end>,
// while incrementing by step with a default of 1.
export function applySliceSelector(
	selector: SliceSelector,
	node: Node,
): NodeList {
	if (!Array.isArray(node.value)) {
		// throw new Error(`JSON node ${JSON.stringify(json)} is not an array`);
		return [];
	}

	const step = selector.step ?? 1;
	const start = selector.start ?? (step >= 0 ? 0 : node.value.length - 1);
	const end =
		selector.end ?? (step >= 0 ? node.value.length : -node.value.length - 1);
	const array: NodeList = [];

	const [lower, upper] = bounds(start, end, step, node.value.length);

	// IF step > 0 THEN
	//
	//   i = lower
	//   WHILE i < upper:
	//     SELECT a(i)
	//     i = i + step
	//   END WHILE
	//
	// ELSE if step < 0 THEN
	//
	//   i = upper
	//   WHILE lower < i:
	//     SELECT a(i)
	//     i = i + step
	//   END WHILE
	//
	// END IF
	if (step > 0) {
		for (let i = lower; i < upper; i += step) {
			array.push(addIndexPath(node, node.value[i], i));
		}
	} else if (step < 0) {
		for (let i = upper; lower < i; i += step) {
			array.push(addIndexPath(node, node.value[i], i));
		}
	}

	return array;
}

// FUNCTION Normalize(i, len):
//   IF i >= 0 THEN
//     RETURN i
//   ELSE
//     RETURN len + i
//   END IF
function normalized(index: number, length: number): number {
	if (index >= 0) {
		return index;
	}
	return length + index;
}

// FUNCTION Bounds(start, end, step, len):
//   n_start = Normalize(start, len)
//   n_end = Normalize(end, len)
//
//   IF step >= 0 THEN
//     lower = MIN(MAX(n_start, 0), len)
//     upper = MIN(MAX(n_end, 0), len)
//   ELSE
//     upper = MIN(MAX(n_start, -1), len-1)
//     lower = MIN(MAX(n_end, -1), len-1)
//   END IF
//
//   RETURN (lower, upper)
function bounds(
	start: number,
	end: number,
	step: number,
	length: number,
): [number, number] {
	const nStart = normalized(start, length);
	const nEnd = normalized(end, length);

	let lower: number;
	let upper: number;
	if (step >= 0) {
		lower = Math.min(Math.max(nStart, 0), length);
		upper = Math.min(Math.max(nEnd, 0), length);
	} else {
		upper = Math.min(Math.max(nStart, -1), length - 1);
		lower = Math.min(Math.max(nEnd, -1), length - 1);
	}

	return [lower, upper];
}
