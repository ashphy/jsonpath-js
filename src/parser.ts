import type { JsonpathQuery } from "./grammar/ast";
import { applyRoot } from "./parsers/root";
import type { Json } from "./types/json";
import { createNode, type Node, type NodeList } from "./types/node";

export function run(json: Json, query: JsonpathQuery): NodeList {
	const rootNode: Node = createNode(json, "$");
	return applyRoot(query, rootNode);
}
