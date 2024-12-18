import { describe, expect, test } from "vitest";
import { convertIRegexpToJsRegexp } from "../../src/utils/convertIRegexpToJsRegexp";

describe("convertIRegexpToJsRegexp", () => {
  test("For any unescaped dots (.) outside character classes eplace the dot with [^\n\r]", () => {
    const iregexPatternString = "a";
    const result = convertIRegexpToJsRegexp(iregexPatternString);
    expect(result).toBe("a");
  });

  test("dot in character class should not be replaced", () => {
    const iregexPatternString = "a[.b]c";
    const result = convertIRegexpToJsRegexp(iregexPatternString);
    expect(result).toBe("a[.b]c");
  });

  test("should escape backslashes", () => {
    const iregexPatternString = "a\\.c";
    const result = convertIRegexpToJsRegexp(iregexPatternString);
    expect(result).toBe("a\\.c");
  });

  test("should replace dot", () => {
    const iregexPatternString = "a.c";
    const result = convertIRegexpToJsRegexp(iregexPatternString);
    expect(result).toBe("a[^\\n\\r]c");
  });
});
