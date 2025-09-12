import { convertIRegexpToJsRegexp } from "../utils/convert-iregexp-to-js-regexp";
import {
	createFunctionDefinition,
	LogicalTypeDef,
	ValueTypeDef,
} from "./function-definitions";
import { convertLogicalType, FunctionType } from "./function-types";

// 2.4.7. search() Function Extension
// Parameters:
//  ValueType (string)
//  ValueType (string conforming to [RFC9485])
// Result:
//  LogicalType
//
// The search() function extension provides a way to check whether a given string
// contains a substring that matches a given regular expression,
// which is in the form described in [RFC9485].
export const SearchFunction = createFunctionDefinition({
	name: "search",
	args: [ValueTypeDef, ValueTypeDef],
	return: LogicalTypeDef,
	function: (node, iRegexpPattern) => {
		if (typeof node !== "string" || typeof iRegexpPattern !== "string") {
			return FunctionType.LogicalFalse;
		}

		const ecmaScriptRegexPattern = convertIRegexpToJsRegexp(iRegexpPattern);
		const testResult = new RegExp(ecmaScriptRegexPattern, "u").test(node);
		return convertLogicalType(testResult);
	},
});
