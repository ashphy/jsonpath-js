import { convertIRegexpToJsRegexp } from "../utils/convertIRegexpToJsRegexp";
import {
	createFunctionDefinition,
	LogicalTypeDef,
	ValueTypeDef,
} from "./function_definitions";
import { convertLogicalType, FunctionType } from "./function_types";

// 2.4.6. match() Function Extension
// Parameters:
//  ValueType (string)
//  ValueType (string conforming to [RFC9485])
// Result:
//  LogicalType
// The match() function extension provides a way to check whether (the entirety of; see Section 2.4.7)
// a given string matches a given regular expression, which is in the form described in [RFC9485].
export const MatchFunction = createFunctionDefinition({
	name: "match",
	args: [ValueTypeDef, ValueTypeDef],
	return: LogicalTypeDef,
	function: (node, iRegexpPattern) => {
		if (typeof node !== "string" || typeof iRegexpPattern !== "string") {
			return FunctionType.LogicalFalse;
		}

		// Perform the following steps on an I-Regexp to obtain an ECMAScript regexp [ECMA-262]:
		//
		// For any unescaped dots (.) outside character classes (first alternative of charClass production), replace the dot with [^\n\r].
		// Envelope the result in ^(?: and )$.
		// The ECMAScript regexp is to be interpreted as a Unicode pattern ("u" flag; see Section 21.2.2 "Pattern Semantics" of [ECMA-262]).
		//
		// Note that where a regexp literal is required, the actual regexp needs to be enclosed in /.
		const ecmaScriptRegexPattern = convertIRegexpToJsRegexp(iRegexpPattern);
		const testResult = new RegExp(`^(?:${ecmaScriptRegexPattern})$`, "u").test(
			node,
		);
		return convertLogicalType(testResult);
	},
});
