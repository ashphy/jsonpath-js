import type { JsonpathQuery } from "./jsonpath";
import { applyRoot } from "./parsers/root";
import type { Json } from "./types/json";
import type { Node, NodeList } from "./types/node";

export function run(json: Json, query: JsonpathQuery): NodeList {
	const rootNode: Node = json;
	return applyRoot(query, rootNode);
}
