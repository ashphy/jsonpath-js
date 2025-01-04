# jsonpath-js

![GitHub License](https://img.shields.io/github/license/ashphy/jsonpath-js)
![NPM Version](https://img.shields.io/npm/v/jsonpath-js)
[![Link Checker](https://github.com/ashphy/jsonpath-js/actions/workflows/lint.yml/badge.svg)](https://github.com/ashphy/jsonpath-js/actions/workflows/lint.yml)

An implementation of RFC 9535 [JSONPath](http://goessner.net/articles/JsonPath/)

## Features

- 100% Compatible with RFC 9535

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
```

## Development

```sh
npm install
npm run test
```
