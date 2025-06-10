export type StringLiteral = string;
export type Int = 0 | number;
export type Number_1 = number;
export type True = boolean;
export type False = boolean;
export type Null = null;

export type Literal = {
	type: "Literal";
	member: Number_1 | StringLiteral | True | False | Null;
};

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
export interface LogicalNot {
	type: "LogicalUnary";
	operator: "!";
	expr: FilterExpression;
}
export type LogicalUnary = LogicalNot;

export type LogicalBinary = LogicalAnd | LogicalOr;
export type LogicalExpression = LogicalBinary | LogicalUnary;

export type MemberNameShorthand = {
	type: "MemberNameShorthand";
	member: string;
};

export type NameSegment = [NameSelector] | [MemberNameShorthand];
export type IndexSegment = [IndexSelector];

export type SingularQuerySegments = (NameSegment | IndexSegment)[];
export type RelSingularQuery = {
	type: "CurrentNode";
	segments: SingularQuerySegments;
};
export type AbsSingularQuery = Root;

export type SingularQuery = RelSingularQuery | AbsSingularQuery;

export type RelQuery = { type: "CurrentNode"; segments: Segment[] };
export type FilterQuery = RelQuery | JsonpathQuery;

export type CurrentNode = RelQuery | RelSingularQuery;

export type FunctionExpr = {
	type: "FunctionExpr";
	name: string;
	args: FunctionArgument[];
};
export type FunctionArgument =
	| Literal
	| FilterQuery
	| FunctionExpr
	| LogicalOrExpr;

export type Comparable = Literal | SingularQuery | FunctionExpr;
export type ComparisonOp = "==" | "!=" | "<=" | ">=" | "<" | ">";
export type ComparisonExpr = {
	type: "ComparisonExpr";
	left: Comparable;
	operator: ComparisonOp;
	right: Comparable;
};

export type TestExpression = LogicalBinary | TestFilterExpr;
export type TestFilterExpr = {
	type: "TestExpr";
	query: FilterQuery | FunctionExpr;
};
export type TestExpr = TestExpression;

export type FilterExpression = LogicalExpression | ComparisonExpr | TestExpr;

export type LogicalOrExpr = FilterExpression;

export type NameSelector = { type: "NameSelector"; member: StringLiteral };
export type WildcardSelector = { type: "WildcardSelector" };
export type SliceSelector = {
	type: "SliceSelector";
	start: Int | null;
	end: Int | null;
	step: (Int | null) | null;
};
export type IndexSelector = { type: "IndexSelector"; index: Int };
export type FilterSelector = { type: "FilterSelector"; expr: LogicalOrExpr };

export type Selector =
	| NameSelector
	| WildcardSelector
	| SliceSelector
	| IndexSelector
	| FilterSelector;
export type BracketedSelection = Selector[];
export type ChildSegement =
	| BracketedSelection
	| [WildcardSelector | MemberNameShorthand];

export type DescendantSegment =
	| {
			type: string;
			selectors: (BracketedSelection | WildcardSelector | MemberNameShorthand) &
				any[];
	  }
	| {
			type: string;
			selectors: (
				| BracketedSelection
				| WildcardSelector
				| MemberNameShorthand
			)[];
	  };

export type Segment = ChildSegement | DescendantSegment;
export type Root = {
	type: "Root";
	segments: Segment[];
};
export type JsonpathQuery = Root;
