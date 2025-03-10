# Contributing to jsonpath-js

Contributions are always welcome!

## About this repository

This parser uses [Peggy](https://peggyjs.org/) as a parser generator.

## Structure

```
├── dist:        # Build files
├── docs:        # Documents
├── grammer:     # Ppeggy grammer file
├── src:         # Source Codes
└── tests:       # Tests
    ├── RFC9535: # Compatibility Test
```

## Development

1. Fork it!
2. Check out submodules for development / testing: `git submodule update --init --recursive`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request :D

### Running Locally

```sh
npm install
npm run test
```

### Building the Parser

If you modify the `grammer/jsonpath.pegjs` file, please rebuild the parser.

```sh
npm run build:parser
```
