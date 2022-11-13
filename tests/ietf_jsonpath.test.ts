import { testJSONPath } from "./utils";

describe('IETF Draft JSON Path', () => {
  describe('3.4.1. Root Selector', () => {
    const json = { "k": "v" };
    test('Root node', () => {
      testJSONPath({ json: json, jsonpath: '$', expected: json });
    });
  });

  describe('3.4.2. Dot Selector', () => {
    const json = { "j": { "k": 3 } };

    test('Named value of an object', () => {
      testJSONPath({ json: json, jsonpath: '$.j', expected: { "k": 3 } });
    });

    test('Named value in nested object', () => {
      testJSONPath({ json: json, jsonpath: '$.j.k', expected: 3 });
    });
  });

  describe('3.4.3. Dot Wildcard Selector', () => {
    const json = {
      "o": { "j": 1, "k": 2 },
      "a": [5, 3]
    };

    test('Object values', () => {
      testJSONPath({ json: json, jsonpath: '$.o.*', expected: [1, 2] });
    });

    test('Array members', () => {
      testJSONPath({ json: json, jsonpath: '$.a.*', expected: [5, 3] });
    });
  });

  describe('3.4.4. Index Selector', () => {
    const json = {
      "o": { "j j": { "k.k": 3 } },
      "a": ["a", "b"],
      "'": { "@": 2 },
      "😀": { "c": "d" }
    };

    test('Named value in nested object', () => {
      testJSONPath({ json: json, jsonpath: "$.o['j j']['k.k']", expected: 3 });
    });

    test('Named value in nested object', () => {
      testJSONPath({ json: json, jsonpath: '$.o["j j"]["k.k"]', expected: 3 });
    });

    test('Member of array', () => {
      testJSONPath({ json: json, jsonpath: '$.a[1]', expected: "b" });
    });

    test('Member of array, from the end', () => {
      testJSONPath({ json: json, jsonpath: '$.a[-2]', expected: "a" });
    });

    test('Unusual member names', () => {
      testJSONPath({ json: json, jsonpath: '$["\'"]["@"]', expected: 2 });
    });

    test('Code point member name', () => {
      testJSONPath({ json: json, jsonpath: '$["\\u0061"][1]', expected: "b" });
    });

    test('surrogate pair member name', () => {
      testJSONPath({ json: json, jsonpath: '$["\\uD83D\\uDE00"]["c"]', expected: "d" });
    });
  });
})