import { extractComments, insertComments } from "./comments-parser";
import JSON5 from "json5";

export const JSON5Format = (text: string) => {
  const { comments = [], text: _text } = extractComments(text);

  // TODO:read user vscode setting editor.json.formatter config
  const json5 = JSON5.stringify(JSON5.parse(_text), { space: 2, quote: '"' });

  if (comments.length > 0) {
    return insertComments(json5, comments);
  }

  return json5;
};
