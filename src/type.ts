import { Json } from "./json";

export type Nothing = {
  __type: "Nothing";
};
export const Nothing: Nothing = { __type: "Nothing" };

export type JSONPathResult = Json | Nothing;

export type Node = Json;

export type NodeList = Node[];
