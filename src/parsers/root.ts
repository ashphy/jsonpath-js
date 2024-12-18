import { Json, JsonValue } from "../json";
import {
  ChildSegement,
  DescendantSegment,
  IndexSelector,
  JsonpathQuery,
  MemberNameShorthand,
  NameSelector,
  Segments,
  Selector,
  WildcardSelector,
} from "../jsonpath";
import { Node, NodeList } from "../type";
import { isJsonObject } from "../utils";
import { traverseDescendant } from "../utils/traverseDescendant";
import { applySliceSelector } from "./array_slice_selector";
import { applyFilterSelector } from "./filter_selector";

// 2.2. Root Identifier
// Every JSONPath query MUST begin with the root identifier $.
export function applyRoot(root: JsonpathQuery, rootNode: Node): NodeList {
  return applySegments(root.segments, rootNode, [rootNode]);
}

// 2.5. Segments
// For each node in an input nodelist, segments apply one or more selectors
// to the node and concatenate the results of each selector into per - input - node nodelists,
// which are then concatenated in the order of the input nodelist to form a single segment result nodelist.
export function applySegments(
  segments: Segments,
  rootNode: Node,
  nodeList: NodeList,
): NodeList {
  const result = segments.reduce((resultNodeList, currentSegment) => {
    return resultNodeList
      .map((node) => {
        return applySegment(currentSegment, rootNode, node);
      })
      .flat();
  }, nodeList);
  return result;
}

// For each node in the input nodelist,
// the resulting nodelist of a child segment is the concatenation of the nodelists
// from each of its selectors in the order that the selectors appear in the list.
// Note: Any node matched by more than one selector is kept as many times in the nodelist.
export function applySegment(
  segment: ChildSegement | DescendantSegment,
  rootNode: Node,
  json: Json,
): NodeList {
  if (Array.isArray(segment)) {
    // ChildSegement
    const selectorResults = segment.map((selector) => {
      const selectorResult = applySelector(selector, rootNode, json);
      return selectorResult;
    });
    const segementResult = selectorResults
      .flat()
      .filter((e) => e !== undefined);
    return segementResult;
  } else {
    // DescendantSegment
    const descendantNodes = traverseDescendant(json);
    return descendantNodes
      .map((node) => {
        return segment.selectors
          .map((selector) => {
            return applySelector(selector, rootNode, node);
          })
          .flat();
      })
      .flat();
  }
}

// 2.3. Selectors
// A selector produces a nodelist consisting of zero or more children of the input value.
function applySelector(
  selector: Selector | MemberNameShorthand,
  rootNode: Node,
  json: Json,
): NodeList {
  const type = selector.type;
  switch (type) {
    case "WildcardSelector":
      return applyWildcardSelector(selector, json);
    case "IndexSelector":
      return applyIndexSelector(selector, json);
    case "SliceSelector":
      return applySliceSelector(selector, json);
    case "MemberNameShorthand":
      return applyMemberNameSelector(selector, json);
    case "NameSelector":
      return applyMemberNameSelector(selector, json);
    case "FilterSelector":
      return applyFilterSelector(selector, rootNode, json);
    default:
      return type satisfies never;
  }
}

// 2.3.2. Wildcard Selector
// A wildcard selector selects the nodes of all children of an object or array.
function applyWildcardSelector(node: WildcardSelector, json: Json): NodeList {
  const results: NodeList = [];

  if (Array.isArray(json)) {
    for (const a in json) {
      if (Object.prototype.hasOwnProperty.call(json, a)) {
        // Note that the children of an object are its member values, not its member names.
        results.push(json[a] as JsonValue);
      }
    }
  } else if (isJsonObject(json)) {
    for (const a in json) {
      if (Object.prototype.hasOwnProperty.call(json, a)) {
        results.push(json[a] as JsonValue);
      }
    }
  }

  // The wildcard selector selects nothing from a primitive JSON value
  // (that is, a number, a string, true, false, or null).
  return results;
}

// 2.3.1. Name Selector
// A name selector '<name>' selects at most one object member value.
function applyMemberNameSelector(
  selector: MemberNameShorthand | NameSelector,
  json: Json,
): NodeList {
  // Nothing is selected from a value that is not an object.
  if (!isJsonObject(json)) {
    return [];
  }

  // Applying the name-selector to an object node
  // selects a member value whose name equals the member name M
  if (selector.member in json) {
    return [json[selector.member]];
  } else {
    // or selects nothing if there is no such member value.
    return [];
  }
}

// 2.3.3. Index Selector
// An index selector <index> matches at most one array element value.
function applyIndexSelector(node: IndexSelector, json: Json): NodeList {
  if (Array.isArray(json)) {
    if (node.index < json.length) {
      const result = json.at(node.index);
      return result === undefined ? [] : [result];
    } else {
      // Index out of bounds
      return [];
    }
  } else {
    return [];
  }
}
