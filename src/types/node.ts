import type { Json } from "./json";

const nodeType: unique symbol = Symbol("NodeType");

export type PathSegment = string | number;
export type Node = { [nodeType]: unknown; value: Json; path: PathSegment[] };
export type NodeList = Node[];

export function createNode(json: Json, path: PathSegment[]): Node {
	return { [nodeType]: undefined, value: json, path };
}

export function addMemberPath(
	base: Node,
	newValue: Json,
	memberName: string,
): Node {
	return createNode(newValue, [...base.path, memberName]);
}

export function addIndexPath(base: Node, newValue: Json, index: number): Node {
	return createNode(newValue, [...base.path, index]);
}

export function isNode(node: unknown): node is Node {
	return typeof node === "object" && node !== null && nodeType in node;
}

export function isNodeList(obj: unknown): obj is NodeList {
	if (!Array.isArray(obj)) return false;
	return obj.every(isNode);
}
