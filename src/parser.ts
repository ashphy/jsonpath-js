import { Json } from "./json";
import { JsonpathQuery } from "./jsonpath";
import { applyRoot } from "./parsers/root";
import { Node, NodeList } from "./type";

export function run(json: Json, jsonpath: JsonpathQuery): NodeList {
  const rootNode: Node = json;
  return applyRoot(jsonpath, rootNode);
}
