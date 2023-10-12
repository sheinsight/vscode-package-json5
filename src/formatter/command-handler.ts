import { window, Range, workspace, Uri } from "vscode";
import { LANGUAGE_ID } from "vs-json5/@shared/constant";
import { JSON5Format } from ".";

export interface CmdHanlderParams {
  path: string;
}

export const JSON5FormatterCmdHander = () => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const { document } = editor;

  if (document.languageId !== LANGUAGE_ID) {
    return;
  }

  const text = document.getText();
  const formattedText = JSON5Format(text);

  const firstLine = editor.document.lineAt(0);
  const lastLine = editor.document.lineAt(editor.document.lineCount - 1);

  const textRange = new Range(
    0,
    firstLine.range.start.character,
    editor.document.lineCount - 1,
    lastLine.range.end.character
  );
  editor.edit((edit) => edit.replace(textRange, formattedText));
};

export const JSONToJSON5CmdHander = async (params: CmdHanlderParams) => {
  const path = Uri.file(params.path);

  const content = await workspace.fs.readFile(path);

  const text = new TextDecoder("utf-8").decode(content);

  if (!text) {
    return;
  }

  const writePath = Uri.file(params.path.replace(".json", ".json5"));

  const formattedText = JSON5Format(text);

  await workspace.fs.writeFile(
    writePath,
    new TextEncoder().encode(formattedText)
  );

  await workspace.fs.delete(path);

  // swtch new window text document

  const document = await workspace.openTextDocument(writePath);

  await window.showTextDocument(document);
};
