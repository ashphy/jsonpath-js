import { JsonValue } from "../json";
import { Node, Nothing } from "../type";

// eslint-disable-next-line @typescript-eslint/no-namespace
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
  } else {
    return FunctionType.LogicalFalse;
  }
};

export const isLogicalType = (
  value: unknown,
): value is FunctionType.LogicalType => {
  return (
    value === FunctionType.LogicalTrue || value === FunctionType.LogicalFalse
  );
};
