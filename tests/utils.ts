import { JSONPathNG } from '../src/jsonpathNg';

interface Param {
  json: object,
  jsonpath: string,
  expected: any
}

export function testJSONPath({ json, jsonpath, expected }: Param) {
  const path = new JSONPathNG(jsonpath);
  expect(path.find(json)).toStrictEqual(expected);
}