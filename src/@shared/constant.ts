export const LANGUAGE_ID = "json5" as const;

export const EXTENSION_DIAGNOSTIC_NAME = "VSCODE_JSON5_DIAGNOSTIC" as const;

export const NPM_PACKAGE_FILE_NAME = "package.json5" as const;

export const USER_AGENT = "Visual Studio Code" as const;

export const VALID_VALUES_TIP_START =
  "Value not accepted. Valid values" as const;

export const DOCUMENT_SELECTOR = {
  scheme: "file",
  language: LANGUAGE_ID,
  pattern: "**/package.json5",
} as const;

// : prompt enum values   ,\n or \n: prompt package.json key
export const COMPLETION_ITEM_TRIGGER_CHARACTERS = [
  ":",
  ",",
  ",\n",
  "\n",
] as const;

export const MOST_DEPENDE_ON = [
  "lodash",
  "async",
  "underscore",
  "request",
  "commander",
  "express",
  "debug",
  "chalk",
  "colors",
  "q",
  "coffee-script",
  "mkdirp",
  "optimist",
  "through2",
  "yeoman-generator",
  "moment",
  "bluebird",
  "glob",
  "gulp-util",
  "minimist",
  "cheerio",
  "pug",
  "redis",
  "node-uuid",
  "socket",
  "io",
  "uglify-js",
  "winston",
  "through",
  "fs-extra",
  "handlebars",
  "body-parser",
  "rimraf",
  "mime",
  "semver",
  "mongodb",
  "jquery",
  "grunt",
  "connect",
  "yosay",
  "underscore",
  "string",
  "xml2js",
  "ejs",
  "mongoose",
  "marked",
  "extend",
  "mocha",
  "superagent",
  "js-yaml",
  "xtend",
  "shelljs",
  "gulp",
  "yargs",
  "browserify",
  "minimatch",
  "react",
  "less",
  "prompt",
  "inquirer",
  "ws",
  "event-stream",
  "inherits",
  "mysql",
  "esprima",
  "jsdom",
  "stylus",
  "when",
  "readable-stream",
  "aws-sdk",
  "concat-stream",
  "chai",
  "Thenable",
  "wrench",
  "react-dom",
] as const;

export const KNOWN_SCOPES = [
  "@types",
  "@angular",
  "@babel",
  "@nuxtjs",
  "@vue",
  "@bazel",
] as const;

export enum SyntaxKind {
  Unknown = 0,
  EOF = 1,
  OpenBraceToken = 2,
  CloseBraceToken = 3,
  OpenBracketToken = 4,
  CloseBracketToken = 5,
  CommaToken = 6,
  ColonToken = 7,
  NullKeyword = 8,
  TrueKeyword = 9,
  FalseKeyword = 10,
  StringLiteral = 11,
  NumericLiteral = 12,
  Identifier = 13,
  InfinityKeyword = 14,
  NaNKeyword = 15,
  LineCommentTrivia = 16,
  BlockCommentTrivia = 17,
  LineBreakTrivia = 18,
  Trivia = 19,
}

export enum ScanError {
  None = 0,
  UnexpectedEndOfComment = 1,
  UnexpectedEndOfString = 2,
}

export enum REGISTER_CMD {
  JSON_TO_JSON5 = "vs.json5.jsonToJson5",
  JSON5_FORMATTER = "vs.json5.formatter",
}
