import { describe } from "node:test";
import { expect, test } from "vitest";
import { testJSONPath } from "../utils";

import cts from "./jsonpath-compliance-test-suite/cts.json";
import { JsonValue } from "../../src/json";
import { JSONPathJS } from "../../src/jsonpathNg";

// https://github.com/jsonpath-standard/jsonpath-compliance-test-suite
describe("JSONPath Compliance Test Suite", () => {
  for (const testCase of cts.tests) {
    if (testCase.invalid_selector) {
      test(testCase.name, () => {
        expect(() => new JSONPathJS(testCase.selector)).toThrowError();
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
