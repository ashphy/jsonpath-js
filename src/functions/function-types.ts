import type { JsonValue } from "../types/json";
import type { Node } from "../types/node";
import type { Nothing } from "../types/nothing";

export namespace FunctionType {
	export type ValueType = JsonValue | Nothing;
	export type NodesType = Node[];
	export type LogicalTrue = { type: "LogicalType" };
	export const LogicalTrue: LogicalTrue = { type: "LogicalType" };
	export type LogicalFalse = { type: "LogicalFalse" };
	export const LogicalFalse: LogicalFalse = { type: "LogicalFalse" };
	export type LogicalType = LogicalTrue | LogicalFalse;
	export type ArgumentTypes = ValueType;
}

export const convertLogicalType = (
	value: boolean,
): FunctionType.LogicalType => {
	if (value) {
		return FunctionType.LogicalTrue;
	}
	return FunctionType.LogicalFalse;
};

export const isLogicalType = (
	value: unknown,
): value is FunctionType.LogicalType => {
	return (
		value === FunctionType.LogicalTrue || value === FunctionType.LogicalFalse
	);
};
