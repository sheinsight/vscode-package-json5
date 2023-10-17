import {
  DocumentFormattingEditProvider,
  DocumentRangeFormattingEditProvider,
  Range,
  TextDocument,
  TextEdit,
  workspace,
  Disposable,
} from "vscode";
import { JSON5Format } from "./json5-fomat";
import { json5Lint } from "vs-json5/validation";
import { JSON5FormatterCmdHander } from "./command-handler";

const NOOP = () => {};

const EMPTY_DISPOSABLE: Disposable = { dispose: NOOP };

export class JSON5EditProvider
  implements
    DocumentRangeFormattingEditProvider,
    DocumentFormattingEditProvider
{
  constructor() {}

  public format = (text: string) => {
    return JSON5Format(text);
  };

  private minimalEdit = (document: TextDocument, string1: string) => {
    const string0 = document.getText();
    let i = 0;
    while (
      i < string0.length &&
      i < string1.length &&
      string0[i] === string1[i]
    ) {
      ++i;
    }
    let j = 0;
    while (
      i + j < string0.length &&
      i + j < string1.length &&
      string0[string0.length - j - 1] === string1[string1.length - j - 1]
    ) {
      ++j;
    }
    const newText = string1.substring(i, string1.length - j);
    const pos0 = document.positionAt(i);
    const pos1 = document.positionAt(string0.length - j);

    return TextEdit.replace(new Range(pos0, pos1), newText);
  };

  private provideEdits = async (
    document: TextDocument
  ): Promise<TextEdit[]> => {
    const result = this.format(document.getText());
    if (!result) {
      return [];
    }
    const edit = this.minimalEdit(document, result);
    return [edit];
  };

  public provideDocumentRangeFormattingEdits = async (
    document: TextDocument
  ): Promise<TextEdit[]> => {
    return this.provideEdits(document);
  };

  public provideDocumentFormattingEdits = async (
    document: TextDocument
  ): Promise<TextEdit[]> => {
    return this.provideEdits(document);
  };
}

export const addFormatOnSave = () => {
  const enabled = workspace
    .getConfiguration("editor")
    .get("formatOnSave") as boolean;

  if (!enabled) {
    return EMPTY_DISPOSABLE;
  }
  const disposable = workspace.onWillSaveTextDocument((e) => {
    const { document } = e;
    const errors = json5Lint(document);
    // lint normal
    if (errors.length > 0) {
      return;
    }

    JSON5FormatterCmdHander();
  });

  return disposable;
};

export * from "./json5-fomat";

export * from "./command-handler";
