/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type TestCase = {
	name: TestCaseName;
	selector: Selector;
	document?: Document;
	result?: TestCaseResult;
	results?: TestCaseResults;
	invalid_selector?: InvalidSelector;
	tags?: Tags;
	[k: string]: unknown;
} & TestCase1;
/**
 * The name of the test case
 */
export type TestCaseName = string;
/**
 * The JSONPath selector
 */
export type Selector = string;
/**
 * The expected result of applying the selector to the document, contains all the matched values
 */
export type TestCaseResult = unknown[];
/**
 * An array of possible expected results of applying the selector to the document, each element of which contains all the matched values
 *
 * @minItems 2
 */
export type TestCaseResults = [
	TestCaseResult,
	TestCaseResult,
	...TestCaseResult[],
];
/**
 * The flag indicating that the selector is not a valid JSONPath selector expression
 */
export type InvalidSelector = true;
export type Tags = string[];
export type TestCase1 =
	| {
			invalid_selector?: never;
			results?: never;
			[k: string]: unknown;
	  }
	| {
			invalid_selector?: never;
			result?: never;
			[k: string]: unknown;
	  }
	| {
			document?: never;
			result?: never;
			results?: never;
			[k: string]: unknown;
	  };

/**
 * JSONPath Compliance Test Suite
 */
export interface ComplianceTestSuite {
	/**
	 * Individual test cases
	 */
	tests: TestCase[];
	[k: string]: unknown;
}
/**
 * The document, the selector is applied to
 */
export interface Document {
	[k: string]: unknown;
}

declare const data: ComplianceTestSuite;
export default data;
