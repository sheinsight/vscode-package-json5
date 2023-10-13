export interface JSON5SyntaxError extends SyntaxError {
  column: number;
  row: number;
}

export interface CommentSpecifier {
  type: string;
  content: string;
  lineNumber: number;
  after?: string;
  on: string;
  whitespace: string;
  before?: string;
}

export type Pointer = `#/${string}`;
