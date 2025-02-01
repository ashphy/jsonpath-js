import { type JsonpathQuery, parse } from "./jsonpath";
import { run } from "./parser";
import type { Json } from "./types/json";

export class JSONPathJS {
	rootNode: JsonpathQuery;

	constructor(private query: string) {
		const parseResult = parse(query);
		this.rootNode = parseResult;
	}

	find(json: Json): Json {
		const resultNodeList = run(json, this.rootNode);
		return resultNodeList.filter((json) => json !== undefined);
	}
}
