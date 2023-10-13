import {
  CompletionItemProvider,
  CompletionItem,
  TextDocument,
  Position,
  CompletionList,
  CompletionItemKind,
  window,
} from "vscode";
import { getLocation } from "json5-parser";
import { packageSchema } from "vs-json5/schema/npm.package";

export class JSON5CompletionItemProvider implements CompletionItemProvider {
  constructor() {}

  public resolveCompletionItem(
    item: CompletionItem
  ): Thenable<CompletionItem | null> {
    return Promise.resolve(item);
  }

  public provideCompletionItems(
    document: TextDocument,
    position: Position
  ): Thenable<CompletionList | null> | null {
    const offset = document.offsetAt(position);
    const location = getLocation(document.getText(), offset);
    const currentKey = location.path[location.path.length - 1];
    let completionList: CompletionItem[] = [];

    const editor = window.activeTextEditor;

    const activeLine = editor?.selection.active.line;

    if (currentKey) {
      const definitionItem = packageSchema?.properties?.[currentKey];
      // TODO: arrayOf enum,filed about path to reslove
      // @ts-ignore
      if (definitionItem?.enum && Array.isArray(definitionItem?.enum)) {
        completionList = // @ts-ignore
          (definitionItem.enum as string[]).map(
            (e) => new CompletionItem(`"${e}"`, CompletionItemKind.Enum)
          );
      }
    } else if (activeLine) {
      // if code wrap and begins with a "," prompt the key of npm package json
      const activeLineText = editor.document.lineAt(activeLine);
      if (!activeLineText.text.trim()) {
        completionList = Object.keys(packageSchema?.properties!).map(
          (key) => new CompletionItem(`${key}`, CompletionItemKind.Enum)
        );
      }
    }

    return Promise.resolve(new CompletionList(completionList));
  }
}
