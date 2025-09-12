# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is jsonpath-js, a TypeScript library implementing RFC 9535 JSONPath specification. The library provides a complete JSONPath query engine with 100% RFC compliance.

## Essential Commands

### Development

- `npm install` - Install dependencies
- `npm test` - Run all tests (uses Vitest)
- `npm run lint` - Run Biome linter
- `npm run build` - Build the library using tsup
- `npm run build:parser` - Regenerate parser from Peggy grammar (required after grammar changes)

### Testing

- `npm test` - Run all tests including RFC compliance tests
- Tests are located in `tests/` with RFC compliance tests in `tests/RFC9535/`

### Submodules

- `git submodule update --init --recursive` - Initialize git submodules (required for RFC compliance tests)

## Architecture Overview

### Core Flow

1. **Parse**: JSONPath string → AST via Peggy-generated parser
2. **Execute**: AST + JSON data → Node objects (value + path pairs)
3. **Return**: Extract values or value+path pairs from final nodes

### Key Components

**Grammar System (`src/grammar/`)**

- `jsonpath.pegjs` - Peggy grammar defining JSONPath syntax
- `jsonpath-js.js` - Generated parser (auto-generated, don't edit directly)
- `ast.d.ts` - TypeScript definitions for AST nodes
- **Important**: Always run `npm run build:parser` after modifying the grammar

**Execution Engine**

- `src/jsonpath-js.ts` - Main `JSONPathJS` class with `find()` and `paths()` methods
- `src/parser.ts` - Central execution engine that processes AST
- `src/parsers/` - Specialized processors for different selector types:
  - `root.ts` - Main segment processing logic
  - `filter-selector.ts` - Complex filtering with comparisons
  - `array-slice-selector.ts` - Array slicing operations
  - `function-extentions.ts` - Built-in function execution

**Type System**

- `src/types/node.ts` - Core Node abstraction (value + path)
- `src/types/json.d.ts` - Comprehensive JSON type definitions
- All components use Node objects to maintain path tracking

**Comparison System (`src/comparator/`)**

- Type-specific comparators for all JSON types (Array, Boolean, Numeric, Object, String)
- Implements all JSONPath comparison operators (==, !=, <, <=, >, >=)
- Critical for filter expressions

**Function System (`src/functions/`)**

- Built-in JSONPath functions: count, length, match, search, value
- Strongly-typed function definitions and execution

### Build System

- **tsup**: Modern bundler producing CommonJS and ESM outputs
- **Peggy**: Parser generator for JSONPath grammar
- **Dual format**: Both CJS and ESM with TypeScript definitions

## Development Guidelines

### Grammar Changes

1. Modify `src/grammar/jsonpath.pegjs`
2. Run `npm run build:parser` to regenerate parser
3. Update `src/grammar/ast.d.ts` if AST structure changes
4. Test thoroughly with RFC compliance suite

### Parser Changes

- Parser logic is in `src/parsers/` - each selector type has its own file
- All processing works with Node objects containing value and path
- Maintain path strings in JSONPath format (e.g., `$['users'][0]['name']`)

### Adding New Functionality

- **Selectors**: Add new selector types in `src/parsers/`
- **Functions**: Add new functions in `src/functions/`
- **Comparators**: Extend comparison logic in `src/comparator/`

### Testing

- RFC compliance tests in `tests/RFC9535/` use official JSONPath test suite
- Unit tests for each component in respective test files
- Always run full test suite before committing grammar changes

### Code Patterns

- Use Node objects for all data flow
- Type-safe AST processing throughout
- Maintain JSONPath specification compliance
- Parse-once, execute-many pattern for performance
