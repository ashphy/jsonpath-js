import { Json } from "./json";
import { JsonpathQuery, parse } from "./jsonpath";
import { run } from "./parser";

export class JSONPathJS {
  rootNode: JsonpathQuery;

  constructor(private jsonpath: string) {
    const parseResult = parse(jsonpath);
    this.rootNode = parseResult;
  }

  find(json: Json): Json {
    const resultNodeList = run(json, this.rootNode);
    const result = resultNodeList.filter((json) => json !== undefined);
    return result;
  }
}
