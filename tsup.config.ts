import { defineConfig } from "tsup";

export default defineConfig({
	target: "ES2022",
	format: ["cjs", "esm"],
	clean: true,
	dts: {
		// tsup 8 sets `baseUrl` for the declaration build, which TypeScript 6
		// rejects as deprecated (egoist/tsup#1388).
		compilerOptions: { ignoreDeprecations: "6.0" },
	},
	minify: true,
	entry: ["src/index.ts"],
});
