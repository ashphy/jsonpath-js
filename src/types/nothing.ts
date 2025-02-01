// The special result Nothing represents the absence of a JSON value
// and is distinct from any JSON value, including null.
export type Nothing = {
	__type: "Nothing";
};
export const Nothing: Nothing = { __type: "Nothing" };
