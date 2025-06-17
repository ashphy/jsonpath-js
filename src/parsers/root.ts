import type {
	ChildSegement,
	DescendantSegment,
	IndexSelector,
	JsonpathQuery,
	MemberNameShorthand,
	NameSelector,
	Segment,
	Selector,
	WildcardSelector,
} from "../grammar/ast";
import {
	type Node,
	type NodeList,
	addIndexPath,
	addMemberPath,
} from "../types/node";
import { isJsonObject } from "../utils";
import { traverseDescendant } from "../utils/traverseDescendant";
import { applySliceSelector } from "./array_slice_selector";
import { applyFilterSelector } from "./filter_selector";

// 2.2. Root Identifier
// Every JSONPath query MUST begin with the root identifier $.
export function applyRoot(root: JsonpathQuery, rootNode: Node): NodeList {
	return applySegments(root.segments, rootNode, [rootNode]);
}

// 2.5. Segments
// For each node in an input nodelist, segments apply one or more selectors
// to the node and concatenate the results of each selector into per - input - node nodelists,
// which are then concatenated in the order of the input nodelist to form a single segment result nodelist.
export function applySegments(
	segments: Segment[],
	rootNode: Node,
	nodeList: NodeList,
): NodeList {
	const result = segments.reduce((resultNodeList, currentSegment) => {
		return resultNodeList.flatMap((node) => {
			return applySegment(currentSegment, rootNode, node);
		});
	}, nodeList);
	return result;
}

// For each node in the input nodelist,
// the resulting nodelist of a child segment is the concatenation of the nodelists
// from each of its selectors in the order that the selectors appear in the list.
// Note: Any node matched by more than one selector is kept as many times in the nodelist.
export function applySegment(
	segment: ChildSegement | DescendantSegment,
	rootNode: Node,
	node: Node,
): NodeList {
	// ChildSegement
	if (Array.isArray(segment)) {
		const selectorResults = segment.map((selector) => {
			const selectorResult = applySelector(selector, rootNode, node);
			return selectorResult;
		});
		const segementResult = selectorResults
			.flat()
			.filter((e) => e !== undefined);
		return segementResult;
	}

	// DescendantSegment
	const descendantNodes = traverseDescendant(node);
	return descendantNodes.flatMap((node) => {
		return segment.selectors.flatMap((selector) => {
			return applySelector(selector, rootNode, node);
		});
	});
}

// 2.3. Selectors
// A selector produces a nodelist consisting of zero or more children of the input value.
function applySelector(
	selector: Selector | MemberNameShorthand,
	rootNode: Node,
	node: Node,
): NodeList {
	const type = selector.type;
	switch (type) {
		case "WildcardSelector":
			return applyWildcardSelector(selector, node);
		case "IndexSelector":
			return applyIndexSelector(selector, node);
		case "SliceSelector":
			return applySliceSelector(selector, node);
		case "MemberNameShorthand":
			return applyMemberNameSelector(selector, node);
		case "NameSelector":
			return applyMemberNameSelector(selector, node);
		case "FilterSelector":
			return applyFilterSelector(selector, rootNode, node);
		default:
			return type satisfies never;
	}
}

// 2.3.2. Wildcard Selector
// A wildcard selector selects the nodes of all children of an object or array.
function applyWildcardSelector(
	selector: WildcardSelector,
	node: Node,
): NodeList {
	const results: NodeList = [];
	const json = node.value;

	if (Array.isArray(json)) {
		for (const a in json) {
			if (Object.prototype.hasOwnProperty.call(node.value, a)) {
				// Note that the children of an object are its member values, not its member names.
				// results.push({ json: json[a], path: `${node.path}[${a}]` });
				results.push(addIndexPath(node, json[a], Number(a)));
			}
		}
	} else if (isJsonObject(json)) {
		for (const a in json) {
			if (Object.prototype.hasOwnProperty.call(json, a)) {
				results.push(addMemberPath(node, json[a], a));
			}
		}
	}

	// The wildcard selector selects nothing from a primitive JSON value
	// (that is, a number, a string, true, false, or null).
	return results;
}

// 2.3.1. Name Selector
// A name selector '<name>' selects at most one object member value.
function applyMemberNameSelector(
	selector: MemberNameShorthand | NameSelector,
	node: Node,
): NodeList {
	// Nothing is selected from a value that is not an object.
	if (!isJsonObject(node.value)) {
		return [];
	}

	// Applying the name-selector to an object node
	// selects a member value whose name equals the member name M
	if (selector.member in node.value) {
		return [addMemberPath(node, node.value[selector.member], selector.member)];
	}
	// or selects nothing if there is no such member value.
	return [];
}

// 2.3.3. Index Selector
// An index selector <index> matches at most one array element value.
function applyIndexSelector(selector: IndexSelector, node: Node): NodeList {
	if (Array.isArray(node.value)) {
		// If the index is negative, it counts from the end of the array.
		const adjustedIndex =
			selector.index < 0 ? node.value.length + selector.index : selector.index;

		if (0 <= adjustedIndex && adjustedIndex < node.value.length) {
			const result = node.value.at(adjustedIndex);
			return result === undefined
				? []
				: [addIndexPath(node, result, adjustedIndex)];
		}
		// Index out of bounds
		return [];
	}
	return [];
}
