import { JSONPathNG } from "./jsonpathNg";

const json = {
  foo: {
    bar: "hoge"
  },
  hoge: {
    test: "test"
  }
};

console.log("RESULT:", new JSONPathNG("$.foo").find(json));
