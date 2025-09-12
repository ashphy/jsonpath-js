import type { JsonpathQuery } from "./grammar/ast";
import { parse } from "./grammar/jsonpath-js";
import { run } from "./parser";
import type { Json } from "./types/json";
import { escapeMemberName } from "./utils/escape-member-name";

type PathResult = {
	value: Json;
	path: string;
};

type PathSegmentsResult = {
	value: Json;
	segments: (string | number)[];
};

/**
 * A JSONPath query engine for executing JSONPath queries against JSON data.
 * Fully implements the RFC 9535 JSONPath specification.
 */
export class JSONPathJS {
	rootNode: JsonpathQuery;

	/**
	 * Creates a new JSONPath query instance.
	 * @param query - The JSONPath query string to parse
	 * @throws Throws an error if the query string is invalid
	 */
	constructor(query: string) {
		const parseResult = parse(query);
		this.rootNode = parseResult;
	}

	/**
	 * Executes the JSONPath query and returns only the matching values.
	 * @param json - The JSON data to query against
	 * @returns An array of matching values
	 */
	find(json: Json): Json {
		const resultNodeList = run(json, this.rootNode);
		return resultNodeList
			.filter((json) => json !== undefined)
			.map((json) => json.value);
	}

	#convertPathSegmentToString(segment: string | number): string {
		if (typeof segment === "string") {
			if (segment === "$") {
				return "$";
			}
			return `['${escapeMemberName(segment)}']`;
		}
		return `[${segment}]`;
	}

	/**
	 * Executes the JSONPath query and returns both matching values and their JSONPath strings.
	 * @param json - The JSON data to query against
	 * @returns An array of objects containing the matching value and its JSONPath string
	 */
	paths(json: Json): PathResult[] {
		return this.pathSegments(json).map((result) => ({
			value: result.value,
			path:
				"$" +
				result.segments
					.map((segment) => this.#convertPathSegmentToString(segment))
					.join(""),
		}));
	}

	/**
	 * Executes the JSONPath query and returns both matching values and their path segments as arrays.
	 * Path segments are returned as arrays containing strings (for object keys) and numbers (for array indices).
	 * The root segment $ is not included in path segments.
	 * @param json - The JSON data to query against
	 * @returns An array of objects containing the matching value and its path segments as an array
	 */
	pathSegments(json: Json): PathSegmentsResult[] {
		const resultNodeList = run(json, this.rootNode);
		return resultNodeList
			.filter((json) => json !== undefined)
			.map((json) => {
				return {
					value: json.value,
					segments: json.path.slice(1), // Remove the root '$' segment from the path
				};
			});
	}
}
