import { ArraySliceSelector, DotSelector, IndexSelector, MemberNameSelector, Node } from "./node";
import { applySliceSelector } from './parsers/array_slice_selector';

export function parse(json: object, jsonpath: Node[]): object {
  const nodes: Node[] = jsonpath;
  let currentJson = json;
  for (const node of nodes) {
    currentJson = apply(node, currentJson);
  }

  return currentJson;
}

function apply(node: Node, json: any): object {
  switch (node.type) {
    case "RootSelector":
      return json;
    case "DotSelector":
      return applyDotSelector(node, json);
    case "DotWildcardSelector":
      return applyDotWildcardSelector(node, json);
    case "IndexSelector":
      return applyIndexSelector(node, json);
    case "ArraySliceSelector":
      return applySliceSelector(node, json);
    case "MemberNameSelector":
      return applyMemberNameSelector(node, json);
    default:
      throw new Error("Unknown JSONPath Node found");
  }
}

function applyDotSelector(node: DotSelector, json: any): object {
  if (node.member in json) {
    return json[node.member];
  } else {
    throw new Error('property not found');
  }
}

function applyDotWildcardSelector(node: Node, json: any): object {
  const results = [];
  for (const a in json) {
    if (Object.prototype.hasOwnProperty.call(json, a)) {
      results.push(json[a]);
    }
  }
  return results;
}

function applyMemberNameSelector(node: MemberNameSelector, json: any): object {
  if (node.member in json) {
    return json[node.member];
  } else {
    throw new Error('property not found');
  }
}

function applyIndexSelector(node: IndexSelector, json: any): object {
  if (Array.isArray(json)) {
    if (node.index < json.length) {
      return json.at(node.index);
    } else {
      throw new Error('Index out of bounds');
    }
  } else {
    throw new Error(`JSON node ${JSON.stringify(json)} is not an array`);
  }
}