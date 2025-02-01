import { expect } from "vitest";
import { JSONPathJS } from "../src/jsonpath_js";
import type { Json, JsonArray } from "../src/types/json";

export function testJSONPath({
	json,
	jsonpath,
	expected,
}: {
	json: Json;
	jsonpath: string;
	expected: Json;
}) {
	const path = new JSONPathJS(jsonpath);
	expect(path.find(json)).toStrictEqual(expected);
}

export function testJSONPathIgnoreingArrayOrder({
	json,
	jsonpath,
	expected,
}: {
	json: Json;
	jsonpath: string;
	expected: JsonArray;
}) {
	const path = new JSONPathJS(jsonpath);
	const result = path.find(json);
	expect(result).toEqual(expect.arrayContaining(expected));
}
