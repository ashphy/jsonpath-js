import type { Node, NodeList } from "../types/node";
import { enumerateNode } from "./enumerateNode";

export const traverseDescendant = (node: Node): NodeList => {
	const nodelist: NodeList = [];
	nodelist.push(node);

	for (const child of enumerateNode(node)) {
		nodelist.push(...traverseDescendant(child));
	}

	return nodelist;
};
