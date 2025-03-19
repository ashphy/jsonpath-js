import { FunctionType } from "../functions/function_types";
import type { Json, JsonValue } from "../types/json";
import { type Node, type NodeList, isNode, isNodeList } from "../types/node";
import { Nothing } from "../types/nothing";
import { isJsonPrimitive } from "../utils";

export type FunctionTypeDef<T> = {
	type: string;
	convert: (arg: JsonValue | NodeList) => T;
};

// When the declared type of the parameter is ValueType and the argument is one of the following:
//  A value expressed as a literal.
//  A singular query. In this case:
//    If the query results in a nodelist consisting of a single node, the argument is the value of the node.
//    If the query results in an empty nodelist, the argument is the special result Nothing.
export const ValueTypeDef: FunctionTypeDef<FunctionType.ValueType> = {
	type: "ValueType",
	convert: (arg) => {
		if (arg === Nothing) return arg;
		if (isJsonPrimitive(arg)) return arg;
		if (isNode(arg)) return arg.value;
		if (isNodeList(arg)) {
			if (arg.length === 0) return Nothing;
			if (arg.length === 1) return arg[0].value;
		}

		throw new Error(
			`Invalid argument type "${JSON.stringify(arg)}" is not a ValueType`,
		);
	},
};

export const NodesTypeDef: FunctionTypeDef<FunctionType.NodesType> = {
	type: "NodesType",
	convert: (arg) => {
		if (isNodeList(arg)) return arg;

		throw new Error(
			`Invalid argument type "${JSON.stringify(arg)}" is not a NodesType`,
		);
	},
};

export const LogicalTypeDef: FunctionTypeDef<FunctionType.LogicalType> = {
	type: "LogicalType",
	convert: (arg) => {
		if (arg === true) return FunctionType.LogicalTrue;
		if (arg === false) return FunctionType.LogicalFalse;
		if (Array.isArray(arg)) {
			if (arg.length === 0) return FunctionType.LogicalFalse;
			if (arg.length >= 1) return FunctionType.LogicalTrue;
		}

		throw new Error(
			`Invalid argument type "${JSON.stringify(arg)}" is not a LogicalType`,
		);
	},
};

export type FunctionDefinition<
	Args extends Array<FunctionTypeDef<unknown>>,
	Return extends FunctionTypeDef<unknown>,
> = {
	name: string;
	args: Args;
	return: Return;
	function: (
		...args: ArgTypesFromDefinition<Args>
	) => TypeFromDefinition<Return>;
};

export const createFunctionDefinition = <
	Args extends Array<FunctionTypeDef<unknown>>,
	Return extends FunctionTypeDef<unknown>,
>(
	def: FunctionDefinition<Args, Return>,
): FunctionDefinition<Args, Return> => {
	return def;
};

type TypeFromDefinition<D extends FunctionTypeDef<unknown>> =
	D extends FunctionTypeDef<infer R> ? R : never;

type ArgTypesFromDefinition<T extends Array<FunctionTypeDef<unknown>>> = {
	[K in keyof T]: T[K] extends FunctionTypeDef<infer R> ? R : never;
};

/**
 * Extracts arguments and converts them to the expected types
 * @param functionDefinition Function Definition
 * @param args Arguments
 * @returns Function Definition expected arguments
 */
export const extractArgs = <
	Args extends Array<FunctionTypeDef<unknown>>,
	Return extends FunctionTypeDef<unknown>,
>(
	functionDefinition: FunctionDefinition<Args, Return>,
	args: (Json | Node | NodeList | Nothing)[],
) => {
	const argDefs = functionDefinition.args;
	if (args.length !== argDefs.length) {
		throw new Error(
			`Invalid number of arguments: ${functionDefinition.name} function requires ${argDefs.length} arguments but received ${args.length}`,
		);
	}

	const convertedArgs = argDefs.map((def, index) => def.convert(args[index]));

	type ReturnType = ArgTypesFromDefinition<typeof argDefs>;
	return convertedArgs as ReturnType;
};
