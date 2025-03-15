import type { Node, NodeList } from "../types/node";
import { enumarateNode } from "./enumarateNode";

export const traverseDescendant = (node: Node): NodeList => {
	const nodelist: NodeList = [];
	nodelist.push(node);

	for (const child of enumarateNode(node)) {
		nodelist.push(...traverseDescendant(child));
	}

	return nodelist;
};
