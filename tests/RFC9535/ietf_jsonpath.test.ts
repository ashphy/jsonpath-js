import { describe, it } from "vitest";
import { testJSONPath, testJSONPathIgnoreingArrayOrder } from "../utils";

describe("RFC 9535 JSONPath: Query Expressions for JSON", () => {
	// https://www.rfc-editor.org/rfc/rfc9535.html#name-root-identifier
	describe("2.2. Root Identifier", () => {
		const json = { k: "v" };
		it("Root node", () => {
			testJSONPath({ json: json, jsonpath: "$", expected: [json] });
		});
	});

	describe("2.3. Selectors", () => {
		// https://www.rfc-editor.org/rfc/rfc9535.html#name-name-selector
		describe("2.3.1. Name Selector", () => {
			const json = {
				o: { "j j": { "k.k": 3 } },
				"'": { "@": 2 },
			};

			it("Named value in a nested object", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.o['j j']",
					expected: [{ "k.k": 3 }],
				});
			});

			it("Nesting further down", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.o['j j']['k.k']",
					expected: [3],
				});
			});

			it("Different delimiter in the query, unchanged Normalized Path", () => {
				testJSONPath({
					json: json,
					jsonpath: '$.o["j j"]["k.k"]',
					expected: [3],
				});
			});

			it("Unusual member names", () => {
				testJSONPath({
					json: json,
					jsonpath: `$["'"]["@"]`,
					expected: [2],
				});
			});
		});

		// https://www.rfc-editor.org/rfc/rfc9535.html#name-wildcard-selector
		describe("2.3.2. Wildcard Selector", () => {
			const json = {
				o: { j: 1, k: 2 },
				a: [5, 3],
			};

			it("Object values", () => {
				testJSONPath({
					json: json,
					jsonpath: "$[*]",
					expected: [{ j: 1, k: 2 }, [5, 3]],
				});
			});

			it("Object values", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.o[*]",
					expected: [1, 2],
				});
			});

			it("Non-deterministic ordering", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.o[*, *]",
					expected: [1, 2, 1, 2],
				});
			});

			it("Array members", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.a[*]",
					expected: [5, 3],
				});
			});
		});

		// https://www.rfc-editor.org/rfc/rfc9535.html#name-index-selector
		describe("2.3.3. Index Selector", () => {
			const json = ["a", "b"];

			it("Element of array", () => {
				testJSONPath({ json: json, jsonpath: "$[1]", expected: ["b"] });
			});

			it("Element of array, from the end", () => {
				testJSONPath({ json: json, jsonpath: "$[-2]", expected: ["a"] });
			});
		});

		// https://www.rfc-editor.org/rfc/rfc9535.html#name-array-slice-selector
		describe("2.3.4. Array Slice Selector", () => {
			const json = ["a", "b", "c", "d", "e", "f", "g"];

			it("Slice with default step", () => {
				testJSONPath({
					json: json,
					jsonpath: "$[1:3]",
					expected: ["b", "c"],
				});
			});

			it("Slice with no end index", () => {
				testJSONPath({
					json: json,
					jsonpath: "$[5:]",
					expected: ["f", "g"],
				});
			});

			it("Slice with step 2", () => {
				testJSONPath({
					json: json,
					jsonpath: "$[1:5:2]",
					expected: ["b", "d"],
				});
			});

			it("Slice with negative step", () => {
				testJSONPath({
					json: json,
					jsonpath: "$[5:1:-2]",
					expected: ["f", "d"],
				});
			});

			it("Slice in reverse order", () => {
				testJSONPath({
					json: json,
					jsonpath: "$[::-1]",
					expected: ["g", "f", "e", "d", "c", "b", "a"],
				});
			});
		});

		// https://www.rfc-editor.org/rfc/rfc9535.html#name-filter-selector
		describe("2.3.5. Filter Selector", () => {
			const json = {
				a: [3, 5, 1, 2, 4, 6, { b: "j" }, { b: "k" }, { b: {} }, { b: "kilo" }],
				o: { p: 1, q: 2, r: 3, s: 5, t: { u: 6 } },
				e: "f",
			};

			it("Member value comparison", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.a[?@.b == 'kilo']",
					expected: [{ b: "kilo" }],
				});
			});

			it("Equivalent query with enclosing parentheses", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.a[?(@.b == 'kilo')]",
					expected: [{ b: "kilo" }],
				});
			});

			it("Array value comparison", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.a[?@>3.5]",
					expected: [5, 4, 6],
				});
			});

			it("Array value existence", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.a[?@.b]",
					expected: [{ b: "j" }, { b: "k" }, { b: {} }, { b: "kilo" }],
				});
			});

			it("Existence of non-singular queries", () => {
				testJSONPath({
					json: json,
					jsonpath: "$[?@.*]",
					expected: [
						[
							3,
							5,
							1,
							2,
							4,
							6,
							{ b: "j" },
							{ b: "k" },
							{ b: {} },
							{ b: "kilo" },
						],
						{ p: 1, q: 2, r: 3, s: 5, t: { u: 6 } },
					],
				});
			});

			it("Nested filters", () => {
				testJSONPath({
					json: json,
					jsonpath: "$[?@[?@.b]]",
					expected: [
						[
							3,
							5,
							1,
							2,
							4,
							6,
							{ b: "j" },
							{ b: "k" },
							{ b: {} },
							{ b: "kilo" },
						],
					],
				});
			});

			it("Non-deterministic ordering", () => {
				testJSONPathIgnoreingArrayOrder({
					json: json,
					jsonpath: "$.o[?@<3, ?@<3]",
					expected: [1, 2, 2, 1],
				});
			});

			it("Array value logical OR", () => {
				testJSONPath({
					json: json,
					jsonpath: '$.a[?@<2 || @.b == "k"]',
					expected: [1, { b: "k" }],
				});
			});

			it("Array value regular expression match", () => {
				testJSONPath({
					json: json,
					jsonpath: '$.a[?match(@.b, "[jk]")]',
					expected: [{ b: "j" }, { b: "k" }],
				});
			});

			it("Array value regular expression search", () => {
				testJSONPath({
					json: json,
					jsonpath: '$.a[?search(@.b, "[jk]")]',
					expected: [{ b: "j" }, { b: "k" }, { b: "kilo" }],
				});
			});

			it("Object value logical AND", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.o[?@>1 && @<4]",
					expected: [2, 3],
				});
			});

			it("Object value logical OR", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.o[?@.u || @.x]",
					expected: [{ u: 6 }],
				});
			});

			it("Comparison of queries with no values", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.a[?@.b == $.x]",
					expected: [3, 5, 1, 2, 4, 6],
				});
			});

			it("Comparisons of primitive and of structured values", () => {
				testJSONPath({
					json: json,
					jsonpath: "$.a[?@ == @]",
					expected: [
						3,
						5,
						1,
						2,
						4,
						6,
						{ b: "j" },
						{ b: "k" },
						{ b: {} },
						{ b: "kilo" },
					],
				});
			});

			// Tests added because they are necessary, although not exemplified in the RFC
			describe("Logical NOT	", () => {
				it("Non Existence value", () => {
					testJSONPath({
						json: json,
						jsonpath: "$.a[?!@.b]",
						expected: [3, 5, 1, 2, 4, 6],
					});
				});

				it("Non Existence value with enclosing parentheses", () => {
					testJSONPath({
						json: json,
						jsonpath: "$.a[?!(@.b)]",
						expected: [3, 5, 1, 2, 4, 6],
					});
				});

				it("Non Existence value with logical OR", () => {
					testJSONPath({
						json: json,
						jsonpath: '$.a[?!(@<2 || @.b == "k")]',
						expected: [3, 5, 2, 4, 6, { b: "j" }, { b: {} }, { b: "kilo" }],
					});
				});
			});

			describe("Function Extensions", () => {
				describe("2.4.4. length() Function Extension", () => {
					it("string length", () => {
						testJSONPath({
							json: json,
							jsonpath: "$.a[?length(@.b) >= 2]",
							expected: [{ b: "kilo" }],
						});
					});

					it("array length", () => {
						testJSONPath({
							json: { a: [1], b: [2, 3], c: [4, 5, 6] },
							jsonpath: "$[?length(@) > 2]",
							expected: [[4, 5, 6]],
						});
					});

					it("object length", () => {
						testJSONPath({
							json: { a: { a: 1 }, b: { a: 1, b: 2 }, c: { a: 1, b: 2, c: 3 } },
							jsonpath: "$[?length(@) == 2]",
							expected: [{ a: 1, b: 2 }],
						});
					});

					it("select nothing from other argument type", () => {
						testJSONPath({
							json: { a: 1, b: null, c: true },
							jsonpath: "$[?length(@) == 2]",
							expected: [],
						});
					});
				});
			});
		});
	});
});
