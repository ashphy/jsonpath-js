import {
	addIndexPath,
	addMemberPath,
	type Node,
	type NodeList,
} from "../types/node";
import { isJsonArray, isJsonObject, isJsonPrimitive } from "../utils";

export function enumerateNode(node: Node): NodeList {
	const { value: json } = node;
	if (isJsonPrimitive(json)) {
		return [];
	}
	if (isJsonArray(json)) {
		return json.map((item, index) => {
			return addIndexPath(node, item, index);
		});
	}
	if (isJsonObject(json)) {
		return Object.entries(json).map(([key, value]) => {
			return addMemberPath(node, value, key);
		});
	}
	return [];
}
