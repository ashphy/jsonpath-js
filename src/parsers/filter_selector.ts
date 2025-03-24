import { ArrayComparator } from "../comparator/ArrayComparator";
import { BooleanComparator } from "../comparator/BooleanComparator";
import { NodeComparator } from "../comparator/NodeComparator";
import { NullComparator } from "../comparator/NullComparator";
import { NumericComparator } from "../comparator/NumericComparator";
import { ObjectComparator } from "../comparator/ObjectComparator";
import { StringComparator } from "../comparator/StringComparator";
import { FunctionType, isLogicalType } from "../functions/function_types";
import type {
	Comparable,
	ComparisonExpr,
	ComparisonOp,
	CurrentNode,
	FilterExpression,
	FilterQuery,
	FilterSelector,
	FunctionExpr,
	LogicalAnd,
	LogicalExpression,
	LogicalNot,
	LogicalOr,
	TestFilterExpr,
} from "../jsonpath";
import type { JsonValue } from "../types/json.d";
import type { Node, NodeList } from "../types/node";
import { Nothing } from "../types/nothing";
import { isJsonArray, isJsonObject, isJsonPrimitive, toArray } from "../utils";
import { enumerateNode } from "../utils/enumarateNode";
import { applyFunction } from "./function_extentions";
import { applyRoot, applySegments } from "./root";

// 2.3.5. Filter Selector
// Filter selectors are used to iterate over the elements or members of structured values
// The structured values are identified in the nodelist offered by the child or descendant segment
// using the filter selector.
export function applyFilterSelector(
	selector: FilterSelector,
	rootNode: Node,
	node: Node,
): NodeList {
	// The filter selector works with arrays and objects exclusively.
	// Its result is a list of(zero, one, multiple, or all)
	// their array elements or member values, respectively.
	// Applied to a primitive value,
	// it selects nothing(and therefore does not contribute to the result of the filter selector).
	if (isJsonPrimitive(node.value)) {
		return [];
	}

	return enumerateNode(node).filter((node) => {
		return applyFilterExpression(selector.expr, rootNode, node);
	});
}

const applyFilterExpression = (
	expr: FilterExpression,
	rootNode: Node,
	node: Node,
): boolean => {
	const expType = expr.type;
	switch (expType) {
		case "ComparisonExpr":
			return applyCompare(expr, rootNode, node);
		case "TestExpr":
			return applyTest(expr, rootNode, node);
		case "LogicalBinary":
		case "LogicalUnary":
			return applyLogical(expr, rootNode, node);
		default:
			expType satisfies never;
	}

	return false;
};

// 2.3.5.2.2. Comparisons
// The comparison operators == and < are defined first, and then these are used to define !=, <=, >, and >=.
const applyCompare = (
	compare: ComparisonExpr,
	rootNode: Node,
	node: Node,
): boolean => {
	const left = applyComparalbe(compare.left, rootNode, node);
	const right = applyComparalbe(compare.right, rootNode, node);
	return evalCompare(left, right, compare.operator);
};

export const evalCompare = (
	left: JsonValue | Nothing,
	right: JsonValue | Nothing,
	operator: ComparisonOp,
): boolean => {
	if (left === Nothing || right === Nothing) {
		return NodeComparator[operator](left, right);
	}

	const leftValue = left;
	const rightValue = right;

	if (isLogicalType(leftValue) || isLogicalType(rightValue)) {
		throw new Error("LogicalType can't be compared");
	}

	if (isJsonObject(leftValue) && isJsonObject(rightValue)) {
		return ObjectComparator[operator](leftValue, rightValue);
	}

	if (isJsonArray(leftValue) && isJsonArray(rightValue)) {
		return ArrayComparator[operator](leftValue, rightValue);
	}

	if (typeof leftValue === "number" && typeof rightValue === "number") {
		return NumericComparator[operator](leftValue, rightValue);
	}

	// equal primitive values that are not numbers,
	if (typeof leftValue === "string" && typeof rightValue === "string") {
		return StringComparator[operator](leftValue, rightValue);
	}

	if (typeof leftValue === "boolean" && typeof rightValue === "boolean") {
		return BooleanComparator[operator](leftValue, rightValue);
	}

	if (leftValue === null && rightValue === null) {
		return NullComparator[operator](leftValue, rightValue);
	}

	if (operator === "!=") {
		return true;
	}

	return false;
};

export const applyCurrentNode = (
	currentNode: CurrentNode,
	rootNode: Node,
	nodeList: NodeList,
): NodeList => {
	return applySegments(currentNode.segments, rootNode, nodeList);
};

const applyComparalbe = (
	comparable: Comparable,
	rootNode: Node,
	node: Node,
): JsonValue | Nothing => {
	// These can be obtained via literal values; singular queries,
	// each of which selects at most one node
	switch (comparable.type) {
		case "Literal":
			return comparable.member;
		case "CurrentNode": {
			const result = applyCurrentNode(comparable, rootNode, [node]);
			return result[0] === undefined ? Nothing : result[0].value;
		}
		case "Root":
			return applyRoot(comparable, rootNode)[0]?.value ?? Nothing;
		case "FunctionExpr":
			return applyFunction(comparable, rootNode, node);
	}
};

// A test expression either tests the existence of a node designated by an embedded query
// or tests the result of a function expression.
const applyTest = (
	expr: TestFilterExpr,
	rootNode: Node,
	json: Node,
): boolean => {
	return applyQuery(expr.query, rootNode, json);
};

// A query by itself in a logical context is an existence test that
// yields true if the query selects at least one node and
// yields false if the query does not select any nodes.
const applyQuery = (
	query: FunctionExpr | FilterQuery,
	rootNode: Node,
	json: Node,
): boolean => {
	switch (query.type) {
		case "FunctionExpr": {
			const functionResult = applyFunction(query, rootNode, json);

			// LogicalType
			if (functionResult === FunctionType.LogicalTrue) return true;
			if (functionResult === FunctionType.LogicalFalse) return false;

			// NodesType
			if (Array.isArray(functionResult)) {
				return functionResult.length > 0;
			}
			// ValueType
			throw new Error(`Function ${query.name} result must be compared`);
		}
		case "CurrentNode": {
			return applyCurrentNode(query, rootNode, [json]).length > 0;
		}
		case "Root": {
			return applyRoot(query, rootNode).length > 0;
		}
	}

	return false;
};

const applyLogical = (
	expr: LogicalExpression,
	rootNode: Node,
	json: Node,
): boolean => {
	switch (expr.operator) {
		case "||":
			return applyOr(expr, rootNode, json);
		case "&&":
			return applyAnd(expr, rootNode, json);
		case "!":
			return applyNot(expr, rootNode, json);
	}
};

const applyOr = (or: LogicalOr, rootNode: Node, json: Node): boolean => {
	// TODO: make efficient
	const left = applyFilterExpression(or.left, rootNode, json);
	const right = applyFilterExpression(or.right, rootNode, json);
	return left || right;
};

const applyAnd = (and: LogicalAnd, rootNode: Node, json: Node): boolean => {
	const left = applyFilterExpression(and.left, rootNode, json);
	const right = applyFilterExpression(and.right, rootNode, json);
	return left && right;
};

const applyNot = (not: LogicalNot, rootNode: Node, json: Node): boolean => {
	const result = applyFilterExpression(not.expr, rootNode, json);
	return !result;
};
