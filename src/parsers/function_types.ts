/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonValue } from "../json";
import { Node, NodeList, Nothing } from "../type";
import { isJsonPrimitive } from "../utils";

export type ValueType = JsonValue | Nothing;
export type NodesType = Node[];
export type ArgumentTypes = ValueType | NodesType;

type FunctionTypeDef<T> = {
  type: string;
  convert: (arg: JsonValue | NodeList) => T | Nothing;
};

// When the declared type of the parameter is ValueType and the argument is one of the following:
//  A value expressed as a literal.
//  A singular query. In this case:
//    If the query results in a nodelist consisting of a single node, the argument is the value of the node.
//    If the query results in an empty nodelist, the argument is the special result Nothing.
export const ValueTypeDef: FunctionTypeDef<ValueType> = {
  type: "ValueType",
  convert: (arg) => {
    if (arg === Nothing) return arg;
    if (isJsonPrimitive(arg)) return arg;
    if (Array.isArray(arg)) {
      if (arg.length === 0) return Nothing;
      if (arg.length === 1) return arg[0];
    }

    throw new Error(
      `Invalid argument type "${JSON.stringify(arg)}" is not a ValueType`,
    );
  },
};

export type FunctionDefinition<T extends Array<FunctionTypeDef<any>>> = {
  name: string;
  args: T;
};

export const LengthFunctionArgsDef: FunctionDefinition<[typeof ValueTypeDef]> =
  {
    name: "length",
    args: [ValueTypeDef],
  };

export const extractAndConvertArgs = <T extends Array<FunctionTypeDef<any>>>(
  functionDefinition: FunctionDefinition<T>,
  args: ArgumentTypes[],
): (T[number]["convert"] extends (arg: any) => infer R ? R : never)[] => {
  // TODO: check if the number of arguments is correct?
  if (args.length !== functionDefinition.args.length) {
    throw new Error("Invalid number of arguments");
  }

  return functionDefinition.args.map((def, index) => {
    return def.convert(args[index]);
  });
};
