import {
	type Node,
	type NodeList,
	addIndexPath,
	addMemberPath,
} from "../types/node";
import { isJsonArray, isJsonObject, isJsonPrimitive } from "../utils";

export function enumarateNode(node: Node): NodeList {
	const { value: json, path } = node;
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
			// return { json: value, path: `${path}['${escapeMemberName(key)}']` };
		});
	}
	return [];
}
