/* eslint-disable @typescript-eslint/no-unused-vars */
import { Json, JsonValue } from "../json";
import { FunctionArgument, FunctionExpr } from "../jsonpath";
import { Node, NodeList, Nothing } from "../type";
import { applyCurrentNode } from "./filter_selector";
import { applyRoot } from "./root";
import { isJsonObject } from "../utils";
import { ValueTypeDef } from "./function_types";
import { convertIRegexpToJsRegexp } from "../utils/convertIRegexpToJsRegexp";

export const applyFunction = (
  func: FunctionExpr,
  rootNode: Node,
  node: Node,
): FunctionType.ValueType | FunctionType.NodesType | boolean => {
  const evaluatedArgs = func.args.map((arg) => {
    return applyFunctionArgument(arg, rootNode, node);
  });

  switch (func.name) {
    case "length": {
      const param = evaluatedArgs[0];
      const convertedParam = ValueTypeDef.convert(param);
      return length(convertedParam);
    }
    case "count": {
      const node = evaluatedArgs.at(0) as FunctionType.NodesType;
      if (node == null) {
        return Nothing;
      }
      return count(node);
    }
    case "match": {
      const node = ValueTypeDef.convert(evaluatedArgs[0]);
      const pattern = ValueTypeDef.convert(evaluatedArgs[1]);
      return match(node, pattern);
    }
    case "search": {
      const node = ValueTypeDef.convert(evaluatedArgs[0]);
      const pattern = ValueTypeDef.convert(evaluatedArgs[1]);
      return search(node, pattern);
    }
    case "value": {
      const nodes = evaluatedArgs[0] as FunctionType.NodesType;
      return value(nodes);
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

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace FunctionType {
  export type ValueType = JsonValue | Nothing;
  export type NodesType = Node[];
  export type ArgumentTypes = ValueType;
}

// 2.4.4. length() Function Extension
// Parameters:
//   ValueType
// Result:
//   ValueType (unsigned integer or Nothing)
//
// The length() function extension provides a way to compute the length of a value
// and make that available for further processing in the filter expression:
const length = (node: FunctionType.ValueType): FunctionType.ValueType => {
  if (node === Nothing) {
    return Nothing;
  }

  // If the argument value is a string, the result is the number of Unicode scalar values in the string.
  if (typeof node === "string") {
    return node.length;
  }

  // If the argument value is an array, the result is the number of elements in the array.
  if (Array.isArray(node)) {
    return node.length;
  }

  // If the argument value is an object, the result is the number of members in the object.
  if (isJsonObject(node)) {
    return Object.keys(node).length;
  }

  // For any other argument value, the result is the special result Nothing.
  return Nothing;
};

// 2.4.5. count() Function Extension
// Parameters:
//  NodesType
// Result:
//  ValueType (unsigned integer)
//
// The count() function extension provides a way to obtain the number of nodes
// in a nodelist and make that available for further processing in the filter expression:
const count = (nodes: FunctionType.NodesType): FunctionType.ValueType => {
  return nodes.length;
};

// 2.4.6. match() Function Extension
// Parameters:
//  ValueType (string)
//  ValueType (string conforming to [RFC9485])
// Result:
//  LogicalType

// The match() function extension provides a way to check whether (the entirety of; see Section 2.4.7)
// a given string matches a given regular expression, which is in the form described in [RFC9485].
const match = (
  node: FunctionType.ValueType,
  iRegexpPattern: FunctionType.ValueType,
): boolean => {
  if (typeof node !== "string" || typeof iRegexpPattern !== "string") {
    return false;
  }

  // Perform the following steps on an I-Regexp to obtain an ECMAScript regexp [ECMA-262]:
  //
  // For any unescaped dots (.) outside character classes (first alternative of charClass production), replace the dot with [^\n\r].
  // Envelope the result in ^(?: and )$.
  // The ECMAScript regexp is to be interpreted as a Unicode pattern ("u" flag; see Section 21.2.2 "Pattern Semantics" of [ECMA-262]).
  //
  // Note that where a regexp literal is required, the actual regexp needs to be enclosed in /.
  const ecmaScriptRegexPattern = convertIRegexpToJsRegexp(iRegexpPattern);
  return new RegExp(`^(?:${ecmaScriptRegexPattern})$`, "u").test(node);
};

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
const search = (
  node: FunctionType.ValueType,
  iRegexpPattern: FunctionType.ValueType,
): boolean => {
  if (typeof node !== "string" || typeof iRegexpPattern !== "string") {
    return false;
  }

  const ecmaScriptRegexPattern = convertIRegexpToJsRegexp(iRegexpPattern);
  return new RegExp(ecmaScriptRegexPattern, "u").test(node);
};

// 2.4.8. value() Function Extension
// Parameters:
//  NodesType
// Result:
//  ValueType
//
// The value() function extension provides a way to convert an instance of NodesType
// to a value and make that available for further processing in the filter expression:
const value = (nodes: FunctionType.NodesType): FunctionType.ValueType => {
  // Its only argument is an instance of NodesType (possibly taken from a filter-query, as in the example above). The result is an instance of ValueType.
  // If the argument contains a single node, the result is the value of the node.
  if (nodes.length === 1) {
    return nodes[0];
  }

  // If the argument is the empty nodelist or contains multiple nodes, the result is Nothing.
  return Nothing;
};
