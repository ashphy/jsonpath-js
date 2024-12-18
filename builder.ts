import * as peggy from "peggy";
import * as fs from "node:fs";
import tspegjs from "ts-pegjs";

const grammerFile = fs.readFileSync("src/jsonpath.pegjs", "utf8");
const footer = fs.readFileSync("src/jsonpath.footer.ts", "utf8");
const parserCode = peggy.generate(grammerFile, {
  plugins: [tspegjs],
  output: "source",
});

const output = `${parserCode}

// Footer
${footer}
`;

fs.writeFileSync("src/jsonpath.ts", output, { encoding: "utf8", flag: "w" });
