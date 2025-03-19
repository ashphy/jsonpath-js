/**
 * Escape a member name for normalized path
 * See: https://www.rfc-editor.org/rfc/rfc9535.html#section-2.7
 * @param name
 * @returns
 */
export const escapeMemberName = (name: string): string => {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: This regex is used to escape control characters
	return name.replace(/['\\\b\f\n\r\t\u0000-\u001F]/g, (char) => {
		switch (char) {
			case "'":
				return "\\'";
			case "\\":
				return "\\\\";
			case "\b":
				return "\\b";
			case "\f":
				return "\\f";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\t":
				return "\\t";
			default:
				return `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
		}
	});
};
