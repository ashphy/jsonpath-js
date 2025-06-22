# jsonpath-js

![GitHub License](https://img.shields.io/github/license/ashphy/jsonpath-js)
[![NPM Version](https://img.shields.io/npm/v/jsonpath-js)](https://www.npmjs.com/package/jsonpath-js)
[![Link Checker](https://github.com/ashphy/jsonpath-js/actions/workflows/lint.yml/badge.svg)](https://github.com/ashphy/jsonpath-js/actions/workflows/lint.yml)

> [!WARNING]
> This library is still in its initial development stage, so please be aware that the API is subject to change.

An implementation of RFC 9535 [JSONPath](http://goessner.net/articles/JsonPath/)

## Try Online

You can test JSONPath expressions online at [https://jsonpath.com/](https://jsonpath.com/).

## Features

- 100% Compatible with RFC 9535

## Supported Runtimes

- Node v20+
- Deno v2+
- Bun v1.2+

## Install

```
npm install jsonpath-js
```

## Usage

### Basic Query Operations

```ts
import { JSONPathJS } from "jsonpath-js";

const query = new JSONPathJS("$.users[*].name");
const result = query.find({
  users: [{ name: "John Doe" }, { name: "Jane Doe" }],
});

// [ 'John Doe', 'Jane Doe' ]
console.log(result);


const pathResult = query.paths({
	users: [{ name: "John Doe" }, { name: "Jane Doe" }],
});

// [
// 	{ value: "John Doe", path: "$['users'][0]['name']" },
// 	{ value: "Jane Doe", path: "$['users'][1]['name']" },
// ];
console.log(pathResult);
```

### Node Modification Operations

The library provides three powerful methods for modifying JSON data in-place using JSONPath queries:

#### `update(json, callback)` - Callback-based Modification

Modifies matched nodes using a callback function that receives the current value and modification context.

```ts
const data = {
  users: [
    { name: "John Doe", age: 30, guid: "abc123" },
    { name: "Jane Doe", age: 25, guid: "def456" }
  ]
};

const query = new JSONPathJS("$.users[*]");

// Remove 'guid' property from all users
const modified = query.update(data, (value, context) => {
  const { guid, ...userWithoutGuid } = value;
  return userWithoutGuid;
});

// Transform values with access to parent and key
const normalized = query.update(data, (value, context) => {
  return {
    ...value,
    name: value.name.toUpperCase(),
    index: context.key, // Array index or object key
    parentPath: context.parent.path
  };
});
```

**Callback Signature:**
```ts
type UpdateCallback<T = Json> = (
  value: T,
  context: {
    key: string | number;        // Property key or array index
    parent: ModifiableNode;      // Parent node with modification capabilities
    path: string;                // Full JSONPath to this node
    root: Json;                  // Reference to root document
  }
) => T | undefined;  // Return undefined to delete the node
```

#### `parents(json)` - Parent-Child Context Access

Returns nodes with their parent context, enabling complex modification patterns.

```ts
const data = {
  document: {
    sections: [
      { title: "Introduction", content: "...", metadata: { id: 1 } },
      { title: "Conclusion", content: "...", metadata: { id: 2 } }
    ]
  }
};

const query = new JSONPathJS("$.document.sections[*].metadata");
const parentNodes = query.parents(data);

parentNodes.forEach(node => {
  // Access parent section to make contextual modifications
  const section = node.parent.value;
  
  // Modify based on parent data
  if (section.title === "Introduction") {
    node.parent.update(currentSection => ({
      ...currentSection,
      metadata: { ...node.value, priority: "high" }
    }));
  }
  
  // Remove metadata entirely for conclusions
  if (section.title === "Conclusion") {
    node.delete(); // Remove this metadata node
  }
});
```

**Return Type:**
```ts
type ParentNode = {
  value: Json;                    // Current node value
  path: string;                   // JSONPath to this node
  key: string | number;           // Property key or array index
  parent: ModifiableNode;         // Parent with modification methods
  root: Json;                     // Reference to root document
  
  // Modification methods
  update(callback: UpdateCallback): void;
  delete(): void;
  replace(newValue: Json): void;
};
```

#### `pathSegments(json)` - Granular Path Access

Provides detailed path information for precise navigation and modification.

```ts
const data = {
  config: {
    database: {
      connections: {
        primary: { host: "localhost", port: 5432 },
        secondary: { host: "backup.db", port: 5432 }
      }
    }
  }
};

const query = new JSONPathJS("$.config.database.connections.*");
const segments = query.pathSegments(data);

segments.forEach(segment => {
  console.log({
    value: segment.value,
    fullPath: segment.path,           // "$['config']['database']['connections']['primary']"
    segments: segment.segments,       // ["config", "database", "connections", "primary"]
    depth: segment.depth,             // 4
    isLeaf: segment.isLeaf,          // true/false
    ancestors: segment.ancestors     // Path to each ancestor node
  });
  
  // Modify based on path depth or segment names
  if (segment.segments.includes("primary")) {
    segment.update(conn => ({ ...conn, ssl: true }));
  }
});
```

**Return Type:**
```ts
type PathSegment = {
  value: Json;                      // Node value
  path: string;                     // Full JSONPath string
  segments: string[];               // Array of path segments
  depth: number;                    // Depth level (0 = root)
  isLeaf: boolean;                  // True if node has no children
  ancestors: AncestorNode[];        // Array of ancestor nodes
  
  // Modification methods
  update(callback: UpdateCallback): void;
  delete(): void;
  replace(newValue: Json): void;
  
  // Navigation methods
  getAncestor(depth: number): AncestorNode | undefined;
  getSegment(index: number): string | undefined;
};

type AncestorNode = {
  value: Json;
  path: string;
  segment: string;
  depth: number;
};
```

#### Modifiable Node Interface

All modification methods return nodes that implement the `ModifiableNode` interface:

```ts
interface ModifiableNode {
  value: Json;
  path: string;
  
  // Core modification methods
  update(callback: UpdateCallback): void;
  replace(newValue: Json): void;
  delete(): void;
  
  // Type checking
  isArray(): boolean;
  isObject(): boolean;
  isPrimitive(): boolean;
  
  // Array-specific methods (when isArray() is true)
  push(value: Json): void;
  splice(start: number, deleteCount?: number, ...items: Json[]): void;
  
  // Object-specific methods (when isObject() is true)
  set(key: string, value: Json): void;
  unset(key: string): void;
  keys(): string[];
}
```

#### Advanced Usage Examples

**Document Transformation:**
```ts
const document = {
  metadata: { version: "1.0", guid: "old-guid" },
  content: {
    sections: [
      { id: 1, text: "Hello", tags: ["intro", "temp"] },
      { id: 2, text: "World", tags: ["conclusion", "temp"] }
    ]
  }
};

// Remove all temporary tags and normalize structure
const query = new JSONPathJS("$..tags");
query.update(document, (tags, context) => {
  return tags.filter(tag => tag !== "temp");
});

// Remove empty tag arrays using parent access
const parentQuery = new JSONPathJS("$.content.sections[*]");
parentQuery.parents(document).forEach(node => {
  if (node.value.tags && node.value.tags.length === 0) {
    delete node.value.tags;
  }
});
```

**Conditional Deletion:**
```ts
const inventory = {
  products: [
    { name: "Widget A", stock: 0, discontinued: true },
    { name: "Widget B", stock: 50, discontinued: false },
    { name: "Widget C", stock: 0, discontinued: false }
  ]
};

// Remove discontinued products
const query = new JSONPathJS("$.products[?@.discontinued == true]");
query.update(inventory, () => undefined); // undefined = delete

// Update low stock products using path context
const lowStockQuery = new JSONPathJS("$.products[?@.stock == 0]");
lowStockQuery.pathSegments(inventory).forEach(segment => {
  if (!segment.value.discontinued) {
    segment.update(product => ({
      ...product,
      status: "out-of-stock",
      restockDate: new Date().toISOString()
    }));
  }
});
```

## Contributing

Please read the [contributing guide](/docs/CONTRIBUTING.md).
