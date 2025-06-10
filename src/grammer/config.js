module.exports = {
	input: "./src/grammer/jsonpath.pegjs",
	allowedStartRules: ["JsonpathQuery"],
	dts: "true",
	output: "src/grammer/jsonpath_js.js",
	returnTypes: {
		JsonpathQuery: "import('./ast.d.ts').JsonpathQuery"
	}
};
