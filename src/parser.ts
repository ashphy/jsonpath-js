import { Json } from "./types/json";
import { JsonpathQuery } from "./jsonpath";
import { applyRoot } from "./parsers/root";
import { Node, NodeList } from "./types/node";

export function run(json: Json, query: JsonpathQuery): NodeList {
  const rootNode: Node = json;
  return applyRoot(query, rootNode);
}
