// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export type Root = {
  type: "Root";
  segments: Segments;
};

export type CurrentNode = RelQuery | RelSingularQuery;

// for 2.3.5. Filter Selector
export type FilterExpression = LogicalExpression | ComparisonExpr | TestExpr;
export type TestExpression = LogicalBinary | TestFilterExpr;
export type TestFilterExpr = {
  type: "TestExpr";
  query: FilterQuery | FunctionExpr;
};

export type LogicalExpression = LogicalBinary | LogicalUnary;

export type LogicalBinary = LogicalAnd | LogicalOr;

export interface LogicalOr {
  type: "LogicalBinary";
  operator: "||";
  left: FilterExpression;
  right: FilterExpression;
}

export interface LogicalAnd {
  type: "LogicalBinary";
  operator: "&&";
  left: FilterExpression;
  right: FilterExpression;
}

export type LogicalUnary = LogicalNot;

export interface LogicalNot {
  type: "LogicalUnary";
  operator: "!";
  expr: FilterExpression;
}
