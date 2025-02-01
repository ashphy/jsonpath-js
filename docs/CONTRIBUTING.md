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
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

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
