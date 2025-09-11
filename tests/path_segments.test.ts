import { expect, it } from "vitest";
import { JSONPathJS } from "../src";

const book1 = {
	category: "reference",
	author: "Nigel Rees",
	title: "Sayings of the Century",
	price: 8.95,
};

const book2 = {
	category: "fiction",
	author: "Evelyn Waugh",
	title: "Sword of Honour",
	price: 12.99,
};

const json = {
	store: {
		book: [book1, book2],
	},
};

it("should return path segments as arrays of strings and numbers", () => {
	const path = new JSONPathJS("$.store.book[*].author");
	const pathSegmentsList = path.pathSegments(json).map((path) => path.segments);

	expect(pathSegmentsList[0]).toEqual(["store", "book", 0, "author"]);
	expect(pathSegmentsList[1]).toEqual(["store", "book", 1, "author"]);
});

it("should return empty segments for root segment", () => {
	const path = new JSONPathJS("$");
	const pathSegmentsList = path.pathSegments(json).map((path) => path.segments);

	expect(pathSegmentsList[0]).toEqual([]);
});
