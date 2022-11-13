import { Node } from "./node";
import { tokenize } from "./lexer";
import { parse } from "./parser";

export class JSONPathNG {
  nodes: Node[]

  constructor(private jsonpath: string) {
    this.nodes = tokenize(jsonpath);
  }

  find(json: object): object {
    return parse(json, this.nodes);
  }
}