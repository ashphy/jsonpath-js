import { JsonValue } from "../types/json";

/**
 * Check the deep equality of two JSON values.
 * @param a - The first JSON value.
 * @param b - The second JSON value.
 * @returns `true` if the two JSON values are equal, `false` otherwise.
 */
export function isEqual(a: JsonValue, b: JsonValue): boolean {
  return isEqualImpl(a, b);
}

function isEqualImpl(
  a: JsonValue,
  b: JsonValue,
  visited: WeakMap<object, unknown> = new WeakMap(),
): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a === null || b === null) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((value, index) => isEqualImpl(value, b[index], visited));
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }

  if (typeof a === "object" && typeof b === "object") {
    // Check circular references
    if (visited.has(a)) {
      return visited.get(a) === b;
    }

    visited.set(a, b);

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => isEqualImpl(a[key], b[key], visited));
  }

  return false;
}
