import { JSONPathNG } from "./jsonpathNg";

const json = {
  foo: {
    bar: ["a", "b", "c", "d", "e", "f", "g"]
  },
  hoge: {
    test: "test"
  }
};

console.log("RESULT:", new JSONPathNG("$.foo.bar[1:2:3]").find(json));
