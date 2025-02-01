import type { Json } from "../types/json";
import type { NodeList } from "../types/node";
import { isJsonObject } from "../utils";

export const traverseDescendant = (json: Json) => {
	const nodelist: NodeList = [];
	nodelist.push(json);

	if (Array.isArray(json)) {
		for (const node of json) {
			nodelist.push(...traverseDescendant(node));
		}
	} else if (isJsonObject(json)) {
		for (const key in json) {
			if (Object.prototype.hasOwnProperty.call(json, key)) {
				nodelist.push(...traverseDescendant(json[key]));
			}
		}
	}

	return nodelist;
};
