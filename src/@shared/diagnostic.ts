import type { TextDocument, Diagnostic } from "vscode";
import type { JSON5SyntaxError } from "../@types";
import { DiagnosticSeverity } from "vscode";

export const getDiagnosticByLintError = (
  e: JSON5SyntaxError,
  document: TextDocument
): Diagnostic[] => {
  const range = document.lineAt(e.row - 1).range;
  return [
    {
      severity: DiagnosticSeverity.Error,
      message: e.message,
      range: range,
    },
  ];
};
