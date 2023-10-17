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

export interface FormatterOptions {
  /**
   * @description enable json5 formatter
   * @default true
   */
  enable: boolean;
  /**
   * @description whether to use single quotes when formatting json5 files
   * @default false
   */
  singleQuote: boolean;
  /**
   * @description format json5 file indentation amount
   * @description 2
   */
  space: number;
}

export interface JOSNUserSettings {
  validate: {
    enable: boolean;
  };
  format: FormatterOptions;
}
