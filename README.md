# jsonpath-js

![GitHub License](https://img.shields.io/github/license/ashphy/jsonpath-js)
[![NPM Version](https://img.shields.io/npm/v/jsonpath-js)](https://www.npmjs.com/package/jsonpath-js)
[![Link Checker](https://github.com/ashphy/jsonpath-js/actions/workflows/lint.yml/badge.svg)](https://github.com/ashphy/jsonpath-js/actions/workflows/lint.yml)

> [!WARNING]
> This library is still in its initial development stage, so please be aware that the API is subject to change.

An implementation of RFC 9535 [JSONPath](http://goessner.net/articles/JsonPath/)

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

## Contributing

Please read the [contributing guide](/docs/CONTRIBUTING.md).
