import {
	createFunctionDefinition,
	NodesTypeDef,
	ValueTypeDef,
} from "./function-definitions";

// 2.4.5. count() Function Extension
// Parameters:
//  NodesType
// Result:
//  ValueType (unsigned integer)
//
// The count() function extension provides a way to obtain the number of nodes
// in a nodelist and make that available for further processing in the filter expression:
export const CountFunction = createFunctionDefinition({
	name: "length",
	args: [NodesTypeDef],
	return: ValueTypeDef,
	function: (nodes) => {
		return nodes.length;
	},
});
