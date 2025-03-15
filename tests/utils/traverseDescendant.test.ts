import { describe, expect, test } from "vitest";
import { createNode } from "../../src/types/node";
import { traverseDescendant } from "../../src/utils/traverseDescendant";

describe("traverseDescendant", () => {
	test("empty object traverses empty", () => {
		const node = createNode({}, "");
		expect(traverseDescendant(node).map((item) => item.value)).toEqual([{}]);
	});

	test("empty object traverses empty", () => {
		const node = createNode([[[1]], [2]], "");
		expect(traverseDescendant(node).map((item) => item.value)).toEqual([
			[[[1]], [2]],
			[[1]],
			[1],
			1,
			[2],
			2,
		]);
	});
});
