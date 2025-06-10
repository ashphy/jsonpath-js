import type { JsonpathQuery } from "./grammer/ast";
import { parse } from "./grammer/jsonpath_js";
import { run } from "./parser";
import type { Json } from "./types/json";

type PathResult = {
	value: Json;
	path: string;
};

export class JSONPathJS {
	rootNode: JsonpathQuery;

	constructor(private query: string) {
		const parseResult = parse(query);
		this.rootNode = parseResult;
	}

	find(json: Json): Json {
		const resultNodeList = run(json, this.rootNode);
		return resultNodeList
			.filter((json) => json !== undefined)
			.map((json) => json.value);
	}

	paths(json: Json): PathResult[] {
		const resultNodeList = run(json, this.rootNode);
		return resultNodeList
			.filter((json) => json !== undefined)
			.map((json) => {
				return {
					value: json.value,
					path: json.path,
				};
			});
	}
}
