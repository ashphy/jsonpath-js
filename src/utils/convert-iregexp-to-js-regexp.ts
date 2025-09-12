// RFC 9485 I-Regexp: An Interoperable Regular Expression Format
// www.rfc-editor.org/rfc/rfc9485.html
//
// 5.3. ECMAScript Regexps
// Perform the following steps on an I-Regexp to obtain an ECMAScript regexp [ECMA-262]:
//
// For any unescaped dots (.) outside character classes (first alternative of charClass production), replace the dot with [^\n\r].
// Envelope the result in ^(?: and )$.
// The ECMAScript regexp is to be interpreted as a Unicode pattern ("u" flag; see Section 21.2.2 "Pattern Semantics" of [ECMA-262]).
//
// Note that where a regexp literal is required, the actual regexp needs to be enclosed in /.
export const convertIRegexpToJsRegexp = (pattern: string): string => {
	let result = "";
	let inCharClass = false;
	let inEscape = false;

	for (let i = 0; i < pattern.length; i++) {
		const c = pattern[i];

		if (inEscape) {
			result += `\\${c}`;
			inEscape = false;
			continue;
		}

		if (c === "\\") {
			inEscape = true;
			continue;
		}

		if (c === "[") {
			inCharClass = true;
			result += c;
			continue;
		}

		if (c === "]") {
			inCharClass = false;
			result += c;
			continue;
		}

		if (c === "." && !inCharClass && !inEscape) {
			result += "[^\\n\\r]";
		} else {
			result += c;
		}
	}

	if (inEscape) {
		throw new Error("Invalid I-Regexp: ends with a backslash escape.");
	}

	return result;
};
