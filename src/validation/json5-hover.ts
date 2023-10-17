import {
  HoverProvider,
  TextDocument,
  Position,
  Hover,
  MarkdownString,
} from "vscode";
import { getLocation } from "json5-parser";
import { Draft07, resolveRefMerge, type JsonSchema } from "json-schema-library";
import { packageSchema } from "vs-json5/schema/npm.package";

const draft = new Draft07(packageSchema, { resolveRef: resolveRefMerge });

export class JSON5HoverProvider implements HoverProvider {
  constructor() {}
  public provideHover(
    document: TextDocument,
    position: Position
  ): Thenable<Hover> | null {
    const offset = document.offsetAt(position);
    const location = getLocation(document.getText(), offset);
    if (!location.previousNode) {
      return null;
    }
    const node = location.previousNode;
    if (
      node &&
      node.offset <= offset &&
      offset <= node.offset + node.length &&
      node.type === "property"
    ) {
      // TODO: find parent node ,but json5-parser not support
      const fieldName = node.value;

      const definitionItem = packageSchema?.properties?.[fieldName];

      // @ts-ignore
      const schemaNode = draft.resolveRef(definitionItem) as JsonSchema;

      if (!schemaNode?.description) {
        return null;
      }

      return Promise.resolve(
        new Hover(new MarkdownString(schemaNode.description))
      );
    }
    return null;
  }
}
