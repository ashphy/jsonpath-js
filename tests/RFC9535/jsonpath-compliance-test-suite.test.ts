import { describe } from "node:test";
import { expect, test } from "vitest";
import { testJSONPath } from "../utils";

import { JSONPathJS } from "../../src/jsonpath_js";
import type { JsonValue } from "../../src/types/json";
import cts from "./jsonpath-compliance-test-suite/cts.json";

// https://github.com/jsonpath-standard/jsonpath-compliance-test-suite
describe("JSONPath Compliance Test Suite", () => {
	for (const testCase of cts.tests) {
		if (testCase.invalid_selector) {
			test(testCase.name, () => {
				expect(() =>
					new JSONPathJS(testCase.selector).find({
						a: "b",
						c: { d: ["e", "f"], g: "h" },
					}),
				).toThrowError();
			});
		} else {
			test(testCase.name, () => {
				testJSONPath({
					json: testCase.document as JsonValue,
					jsonpath: testCase.selector,
					expected: testCase.result ?? (testCase.results?.[0] as JsonValue),
				});
			});
		}
	}
});
