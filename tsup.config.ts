import { defineConfig } from "tsup";

export default defineConfig({
  target: "ES2022",
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  minify: true,
});
