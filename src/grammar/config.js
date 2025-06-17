module.exports = {
	input: "./src/grammar/jsonpath.pegjs",
	allowedStartRules: ["JsonpathQuery"],
	dts: "true",
	output: "src/grammar/jsonpath_js.js",
	returnTypes: {
		JsonpathQuery: "import('./ast.d.ts').JsonpathQuery",
	},
};
