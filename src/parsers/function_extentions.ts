/* eslint-disable @typescript-eslint/no-unused-vars */
import { Json } from "../json";
import { FunctionArgument, FunctionExpr } from "../jsonpath";
import { Node, NodeList, Nothing } from "../type";
import { applyCurrentNode } from "./filter_selector";
import { applyRoot } from "./root";
import { extractArgs } from "../functions/function_definitions";
import { LengthFunction } from "../functions/length";
import { CountFunction } from "../functions/count";
import { MatchFunction } from "../functions/match";
import { SearchFunction } from "../functions/search";
import { ValueFunction } from "../functions/value";
import { FunctionType } from "../functions/function_types";

const FunctionDefinitions = {
  length: LengthFunction,
  count: CountFunction,
  match: MatchFunction,
  search: SearchFunction,
  value: ValueFunction,
};

export const applyFunction = (
  func: FunctionExpr,
  rootNode: Node,
  node: Node,
):
  | FunctionType.ValueType
  | FunctionType.NodesType
  | FunctionType.LogicalType => {
  const evaluatedArgs = func.args.map((arg) => {
    return applyFunctionArgument(arg, rootNode, node);
  });

  switch (func.name) {
    case "length": {
      const args = extractArgs(FunctionDefinitions.length, evaluatedArgs);
      return FunctionDefinitions.length.function.call(undefined, ...args);
    }
    case "count": {
      const args = extractArgs(FunctionDefinitions.count, evaluatedArgs);
      return FunctionDefinitions.count.function.call(undefined, ...args);
    }
    case "match": {
      const args = extractArgs(FunctionDefinitions.match, evaluatedArgs);
      return FunctionDefinitions.match.function.call(undefined, ...args);
    }
    case "search": {
      const args = extractArgs(FunctionDefinitions.search, evaluatedArgs);
      return FunctionDefinitions.search.function.call(undefined, ...args);
    }
    case "value": {
      const args = extractArgs(FunctionDefinitions.value, evaluatedArgs);
      return FunctionDefinitions.value.function.call(undefined, ...args);
    }
  }

  return Nothing;
};

const applyFunctionArgument = (
  argument: FunctionArgument,
  rootNode: Node,
  json: Json,
): Node | NodeList | Nothing => {
  switch (argument.type) {
    case "Literal":
      return argument.member;
    case "CurrentNode":
      return applyCurrentNode(argument, rootNode, [json]);
    case "Root":
      return applyRoot(argument, rootNode);
    case "FunctionExpr":
      return applyFunction(argument, rootNode, json);
    default:
      // TODO: remove default case
      throw new Error(`Unknown argument type "${argument.type}"`);
  }

  return Nothing;
};
