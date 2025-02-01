import { convertIRegexpToJsRegexp } from "../utils/convertIRegexpToJsRegexp";
import {
	LogicalTypeDef,
	ValueTypeDef,
	createFunctionDefinition,
} from "./function_definitions";
import { FunctionType, convertLogicalType } from "./function_types";

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
