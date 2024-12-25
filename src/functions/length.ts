import { createFunctionDefinition, ValueTypeDef } from "./function_definitions";
import { Nothing } from "../types/nothing";
import { isJsonObject } from "../utils";
import { FunctionType } from "./function_types";

// 2.4.4. length() Function Extension
// Parameters:
//   ValueType
// Result:
//   ValueType (unsigned integer or Nothing)
//
// The length() function extension provides a way to compute the length of a value
// and make that available for further processing in the filter expression:
export const LengthFunction = createFunctionDefinition({
  name: "length",
  args: [ValueTypeDef],
  return: ValueTypeDef,
  function: (node) => {
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
  },
});

// 2.4.4. length() Function Extension
// Parameters:
//   ValueType
// Result:
//   ValueType (unsigned integer or Nothing)
//
// The length() function extension provides a way to compute the length of a value
// and make that available for further processing in the filter expression:
export const length = (
  node: FunctionType.ValueType,
): FunctionType.ValueType => {
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
