import type { ExtensionContext } from "vscode";
import { languages, commands } from "vscode";
import { addJSON5Validation, JSON5HoverProvider } from "vs-json5/validation";
import { LANGUAGE_ID, REGISTER_CMD } from "vs-json5/@shared/constant";
import {
  JSON5EditProvider,
  JSON5FormatterCmdHander,
  JSONToJSON5CmdHander,
} from "vs-json5/formatter";
import { npmActivate } from "vs-json5/npm";

export const activate = (ctx: ExtensionContext) => {
  // json5 validate
  ctx.subscriptions.push(addJSON5Validation());

  // vscode npm extension active
  npmActivate(ctx);

  // json5 code formatter
  languages.registerDocumentFormattingEditProvider(
    { scheme: "file", language: LANGUAGE_ID },
    new JSON5EditProvider()
  );

  // right click panel format json5 code
  ctx.subscriptions.push(
    commands.registerCommand(
      REGISTER_CMD.JSON5_FORMATTER,
      JSON5FormatterCmdHander
    )
  );

  // right click panel format convert  .json extension file into to extension file .json5  ant format the code

  ctx.subscriptions.push(
    commands.registerCommand(REGISTER_CMD.JSON_TO_JSON5, JSONToJSON5CmdHander)
  );

  // hover json5 key and show field information
  ctx.subscriptions.push(
    languages.registerHoverProvider(LANGUAGE_ID, new JSON5HoverProvider())
  );
};

export const deactivate = () => {};
