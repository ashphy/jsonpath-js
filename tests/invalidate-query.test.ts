import { expect, test } from "vitest";
import { JSONPathJS } from "../src";

test("Query that does not start with $ should throw an error", () => {
	expect(() => new JSONPathJS("*")).toThrowError();
});

test("Query with unclosed brackets should throw an error", () => {
	expect(() => new JSONPathJS("$.store.book[0")).toThrowError();
});
