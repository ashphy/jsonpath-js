import { Node } from "./node";
import { Scanner } from "./scanner";

export function tokenize(jsonpath: string): Node[] {
  const nodes: Array<Node> = [];
  const scanner = new Scanner(jsonpath);
  parseRootSelector(scanner, nodes);

  console.log("Lexer: ", nodes);
  return nodes;
}

function parseRootSelector(scanner: Scanner, nodes: Node[]) {
  const c = scanner.next();
  if (c === "$") {
    scanner.consume()
    nodes.push({ type: "RootSelector" });
    consumeBlankSpaces(scanner);
    parseSegments(scanner, nodes);
    return;
  }

  throw new Error();
}

// json-path = root-identifier *(S (child-segment               /
//                                  descendant-segment))
function parseSegments(scanner: Scanner, nodes: Node[]) {
  if (scanner.peek() != Scanner.EOF) {
    parseChildSegment(scanner, nodes);
    parseSegments(scanner, nodes);
  }
}

// child-segment             = (child-longhand /
//                              dot-wildcard-shorthand /
//                              dot-member-name-shorthand)
function parseChildSegment(scanner: Scanner, nodes: Node[]) {
  const c = scanner.next();
  switch(c) {
    case ".":
      parseDotShorthands(scanner, nodes);
      break;
    case "[":
      parseChildLongHand(scanner, nodes);
      break;
    case Scanner.EOF:
      return;
    default:
      throw new Error(c);
  }
}

// dot-wildcard-shorthand    = "." wildcard
// dot-member-name-shorthand = "." dot-member-name
function parseDotShorthands(scanner: Scanner, nodes: Node[]) {
  const c = scanner.peek();

  // 3.4.3. Dot Wildcard Selector
  if (c === "*") {
    scanner.next();
    nodes.push({ type: "DotWildcardSelector" });
  } else {
    // 3.4.2. Dot Selector
    parseDotMemberName(scanner, nodes);
  }
}

// child-longhand = "[" S selector 1*(S "," S selector) S "]"
function parseChildLongHand(scanner: Scanner, nodes: Node[]) {
  consumeBlankSpaces(scanner);
  parseSelectors(scanner, nodes);
  consumeBlankSpaces(scanner);

  if (scanner.next() !== ']') {
    throw new Error();
  }
  scanner.consume();
}

// selector =  ( name-selector  /
//               index-selector /
//               slice-selector /
//               filter-selector
//             )
function parseSelectors(scanner: Scanner, nodes: Node[]) {
  const c = scanner.peek();
  switch (c) {
    case '"':
      parseQuotedMemberName(scanner, nodes);
      break;
    case "'":
      parseQuotedMemberName(scanner, nodes);
      break;
    case "-":
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      parseElementIndex(scanner, nodes);
      break;
    case ":":
      parseArraySliceSelector(scanner,  nodes, undefined);
      break;
    default:
      throw new Error();
  }
}

function parseDotMemberName(scanner: Scanner, nodes: Node[]) {
  let c: string | undefined;
  scanner.consume();
  c = scanner.next();

  if (c === undefined) {
    throw new Error();
  }

  if (!isNameFirst(c)) {
    throw new Error();
  }

  while ((c = scanner.next()) != Scanner.EOF) {
    if (!isNameChar(c)) {
      scanner.back();
      break;
    }
  }

  nodes.push({ type: "DotSelector", member: scanner.consume() });
}

// quoted-member-name  = string-literal
// string-literal      = %x22 *double-quoted %x22 /       ; "string"
//                       %x27 *single-quoted %x27         ; 'string'
// double-quoted       = unescaped /
//                       %x27      /                       ; '
//                       ESC %x22  /                       ; \"
//                       ESC escapable
//
// single-quoted       = unescaped /
//                       %x22      /                       ; "
//                       ESC %x27  /                       ; \'
//                       ESC escapable
function parseQuotedMemberName(scanner: Scanner, nodes: Node[]) {
  const quoteChar = scanner.next();
  const acceptableQuoteChar = quoteChar === '"' ? "'" : '"';
  scanner.consume();

  let memberName = '';
  let c;

  while ((c = scanner.next()) != Scanner.EOF) {
    if (isUnescaped(c) || c === acceptableQuoteChar) {
      continue;
    }

    if (isESC(c)) {
      const next = scanner.nextOrError();

      if (next === 'u') {
        memberName = memberName + scanner.consume({ trim: 2 });
        const unicodeChar = parseUnicodeChar(scanner);
        memberName = memberName + unicodeChar;
        continue;
      }

      if (next === quoteChar || isEscapable(next)) {
        continue;
      }
    }

    break;
  }

  if (c === quoteChar) {
    memberName = memberName + scanner.consume({ trim: 1 } )
    nodes.push({ type: "MemberNameSelector", member: memberName});
  } else {
    throw new Error();
  }
}

// element-index   = int                             ; decimal integer
// int             = ["-"] ( "0" / (DIGIT1 *DIGIT) ) ; -  optional
function parseElementIndex(scanner: Scanner, nodes: Node[]) {
  scanner.consume();
  const index = parseIntElement(scanner);

  const next = scanner.peek();

  if (next !== undefined && isBlankSpace(next)) {
    scanner.next();
    consumeBlankSpaces(scanner);
    scanner.expect(':');
    parseArraySliceSelector(scanner, nodes, index);
    return;
  }

  if (next !== undefined && next === ':') {
    scanner.expect(':');
    parseArraySliceSelector(scanner, nodes, index);
    return;
  }

  nodes.push({ type: "IndexSelector", index: index });
}

function parseIntElement(scanner: Scanner): number {
  if (scanner.peek() === '-') {
    scanner.next();
  }

  if (scanner.peek() === '0') {
    scanner.next();
    return parseInt(scanner.consume(), 10);
  }

  const digit1 = scanner.nextOrError();
  if (!isDigit1(digit1)) {
    throw new Error(`Expected number but received ${digit1}`);
  }

  let c;
  while ((c = scanner.next()) != Scanner.EOF) {
    if (!isDigit(c)) {
      scanner.back();
      return parseInt(scanner.consume(), 10);
    }
  }

  throw new Error(`Unexpected EOF`);
}

// slice-selector =  [start S] ":" S [end S] [":" [S step ]]
// start          = int       ; included in selection
// end            = int       ; not included in selection
// step           = int       ; default: 1
function parseArraySliceSelector(scanner: Scanner, nodes: Node[], start: number | undefined) {
  let end;
  let step;

  consumeBlankSpaces(scanner);

  if (scanner.peekOrError() === ':') {
    // end is omitted
    scanner.expect(':');
    end = undefined
  } else {
    end = parseIntElement(scanner);
  }

  consumeBlankSpaces(scanner);

  // step
  if (scanner.peek() === ':') {
    scanner.expect(':');
    consumeBlankSpaces(scanner);
    step = parseIntElement(scanner);
  }

  nodes.push({ type: "ArraySliceSelector", start: start, end: end, step: step });
}

// hexchar = non-surrogate / (high-surrogate "\" %x75 low-surrogate)
// non-surrogate = ((DIGIT / "A"/"B"/"C" / "E"/"F") 3HEXDIG) /
//                  ("D" %x30-37 2HEXDIG )
function parseUnicodeChar(scanner: Scanner): string {
  scanner.consume();

  const c = scanner.nextOrError();
  if (isDigit(c) || checkCharList(['A', 'B', 'C', 'E', 'F'], c)) {
    return parseNonSurrogate(scanner);
  } else if (c === "D") {
    const second = scanner.peekOrError();
    if (checkCodeRange([{ ge: 0x30, le: 0x37 }], second)) {
      return parseNonSurrogate(scanner);
    } else {
      // surrogate pair
      return parseSurrogatePair(scanner);
    }
  }

  throw new Error(`Unknown unicode char ${c}`);
}

function parseNonSurrogate(scanner: Scanner): string {
  for (let i = 0; i < 3; i++) {
    const c = scanner.nextOrError();
    if (!isHexDig(c)) {
      throw new Error(`Unknown unicode char ${c}`);
    }
  }

  const charCode = parseInt(scanner.consume(), 16);
  return String.fromCharCode(charCode);
}

// (high-surrogate "\" %x75 low-surrogate)
// high-surrogate = "D" ("8"/"9"/"A"/"B") 2HEXDIG
// low-surrogate = "D" ("C"/"D"/"E"/"F") 2HEXDIG
function parseSurrogatePair(scanner: Scanner): string {
  const c = scanner.nextOrError();
  if (checkCharList(['8', '9', 'A', 'B'], c)) {
    // high-surrogate
    for (let i = 0; i < 2; i++) {
      const c = scanner.nextOrError();
      if (!isHexDig(c)) {
        throw new Error(`Unknown unicode char ${c}`);
      }
    }

    const highSurrogateChar = parseInt(scanner.consume(), 16);

    // low-surrogate
    const lowSurrogateEscape = scanner.takeOrError(2)
    if (lowSurrogateEscape !== '\\u') {
      throw new Error(`Unknown unicode char ${lowSurrogateEscape}`);
    }
    scanner.consume();

    if (scanner.nextOrError() !== 'D') {
      throw new Error(`Unknown unicode char ${c}`);
    }

    if (!checkCharList(['C', 'D', 'E', 'F'], scanner.nextOrError())) {
      throw new Error(`Unknown unicode char ${c}`);
    }

    for (let i = 0; i < 2; i++) {
      const c = scanner.nextOrError();
      if (!isHexDig(c)) {
        throw new Error(`Unknown unicode char ${c}`);
      }
    }

    const lowSurrogateChar = parseInt(scanner.consume(), 16);
    return String.fromCharCode(highSurrogateChar, lowSurrogateChar);
  } else {
    throw new Error(`Unknown unicode char ${c}`);
  }
}

// HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
function isHexDig(c: string): boolean {
  return isDigit(c) || checkCharList(['A', 'B', 'C', 'D', 'E', 'F'], c);
}

// unescaped           = %x20-21 /                         ; s. RFC 8259
//                       %x23-26 /                         ; omit "
//                       %x28-5B /                         ; omit '
//                       %x5D-10FFFF                       ; omit \
function isUnescaped(c: string): boolean {
  return checkCodeRange([
    { ge: 0x20, le: 0x21 },
    { ge: 0x23, le: 0x26 },
    { ge: 0x28, le: 0x5B },
    { ge: 0x5D, le: 0x10FFFF }
  ], c);
}

// escapable           = ( %x62 / %x66 / %x6E / %x72 / %x74 / ; \b \f \n \r \t
//                           ; b /         ;  BS backspace U+0008
//                           ; t /         ;  HT horizontal tab U+0009
//                           ; n /         ;  LF line feed U+000A
//                           ; f /         ;  FF form feed U+000C
//                           ; r /         ;  CR carriage return U+000D
//                           "/" /          ;  /  slash (solidus) U+002F
//                           "\" /          ;  \  backslash (reverse solidus) U+005C
//                           (%x75 hexchar) ;  uXXXX      U+XXXX
//                       )
//
// hexchar = non-surrogate / (high-surrogate "\" %x75 low-surrogate)
// non-surrogate = ((DIGIT / "A"/"B"/"C" / "E"/"F") 3HEXDIG) /
//                  ("D" %x30-37 2HEXDIG )
// high-surrogate = "D" ("8"/"9"/"A"/"B") 2HEXDIG
// low-surrogate = "D" ("C"/"D"/"E"/"F") 2HEXDIG
//
// HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
function isEscapable(c: string): boolean {
  return checkCodeList([
    0x62,
    0x66,
    0x6e,
    0x72,
    0x74,
    0x2f,
    0x5c
  ], c);
}

function isNameChar(c: string): boolean {
  return isDigit(c) || isNameFirst(c);
}

// name-first      =
//                       ALPHA /
//                       "_"   /           ; _
//                       %x80-10FFFF       ; any non-ASCII Unicode character
function isNameFirst(c: string): boolean {
  return isAlpha(c) || c === "_" || isNonAsciiUnicodeCharacter(c);
}

// ALPHA           =  %x41-5A / %x61-7A    ; A-Z / a-z
function isAlpha(c: string): boolean {
  return checkCodeRange([
    { ge: 0x41, le: 0x5a },
    { ge: 0x61, le: 0x7a }
  ], c);
}

// %x80-10FFFF       ; any non-ASCII Unicode character
function isNonAsciiUnicodeCharacter(c: string): boolean {
  return checkCodeRange([{ ge: 0x80, le: 0x10ffff }], c);
}

// DIGIT           =  %x30-39              ; 0-9
function isDigit(c: string): boolean {
  return checkCodeRange([{ ge: 0x30, le: 0x39 }], c);
}

// DIGIT1          = %x31-39                         ; 1-9 non-zero digit
function isDigit1(c: string): boolean {
  return checkCodeRange([{ ge: 0x31, le: 0x39 }], c);
}

// ESC                 = %x5C                              ; \  backslash
function isESC(c: string): boolean {
  return c === '\\';
}

function consumeBlankSpaces(scanner: Scanner) {
  let c;
  while ((c = scanner.next()) != Scanner.EOF) {
    if (!isBlankSpace(c)) {
      scanner.back();
      break;
    }
  }
  scanner.consume();
}

// %x20 / ; Space
// %x09 / ; Horizontal tab
// %x0A / ; Line feed or New line
// %x0D   ; Carriage return
function isBlankSpace(c: string): boolean {
  return checkCodeList([0x20, 0x09, 0x0A, 0x0D], c);
}

function checkCodeList(codes: number[], c: string) {
  const code = c.charCodeAt(0);
  return codes.some((c) => c === code);
}

function checkCodeRange(ranges: { ge: number, le: number }[], c: string): boolean {
  const code = c.charCodeAt(0);
  return ranges.some((range) => {
    return range.ge <= code && code <= range.le;
  });
}

function checkCharList(chars: string[], c: string): boolean {
  return chars.some((char) => char === c);
}