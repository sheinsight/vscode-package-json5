/**
 * @link https://github.com/pnpm/pnpm/blob/main/text/comments-parser/src/extractComments.ts
 */

// @ts-ignore
import { parseString, stripComments } from "strip-comments-strings";
import { type CommentSpecifier } from "vs-json5/@types";

export function extractComments(text: string) {
  const hasFinalNewline = text.endsWith("\n");
  if (!hasFinalNewline) {
    /* For the sake of the comment parser, which otherwise loses the
     * final character of a final comment
     */
    text += "\n";
  }
  const { comments: rawComments } = parseString(text);
  const comments: CommentSpecifier[] = [];
  let stripped = stripComments(text);
  if (!hasFinalNewline) {
    stripped = stripped.slice(0, -1);
  }
  let offset = 0; // accumulates difference of indices from text to stripped
  for (const comment of rawComments) {
    /* Extract much more context for the comment needed to restore it later */
    // Unfortunately, JavaScript lastIndexOf does not have an end parameter:
    const preamble: string = stripped.slice(0, comment.index - offset);
    const lineStart = Math.max(preamble.lastIndexOf("\n"), 0);
    const priorLines = preamble.split("\n");
    let lineNumber = priorLines.length;
    let after = "";
    let hasAfter = false;
    if (lineNumber === 1) {
      if (preamble.trim().length === 0) {
        lineNumber = 0;
      }
    } else {
      after = priorLines[lineNumber - 2];
      hasAfter = true;
      if (priorLines[0].trim().length === 0) {
        /* JSON5.stringify will not have a whitespace-only line at the start */
        lineNumber -= 1;
      }
    }
    let lineEnd = stripped.indexOf("\n", lineStart === 0 ? 0 : lineStart + 1);
    if (lineEnd < 0) {
      lineEnd = stripped.length;
    }
    const whitespaceMatch = stripped
      .slice(lineStart, comment.index - offset)
      .match(/^\s*/);

    const newComment: CommentSpecifier = {
      type: comment.type,
      content: comment.content,
      lineNumber,
      on: stripped.slice(lineStart, lineEnd),
      whitespace: whitespaceMatch ? whitespaceMatch[0] : "",
    };

    if (hasAfter) {
      newComment.after = after;
    }
    const nextLineEnd = stripped.indexOf("\n", lineEnd + 1);
    if (nextLineEnd >= 0) {
      newComment.before = stripped.slice(lineEnd, nextLineEnd);
    }
    comments.push(newComment);
    offset += comment.indexEnd - comment.index;
  }
  return {
    text: stripped,
    comments: comments.length ? comments : undefined,
    hasFinalNewline,
  };
}

export function insertComments(json: string, comments: CommentSpecifier[]) {
  // We need to reintroduce the comments. So create an index of
  // the lines of the manifest so we can try to match them up.
  // We eliminate whitespace and quotes in the index entries,
  // because pnpm may have changed them.
  const jsonLines = json.split("\n");
  const index: Record<string, number> = {};
  const canonicalizer = /[\s'"]/g;
  for (let i = 0; i < jsonLines.length; ++i) {
    const key = jsonLines[i].replace(canonicalizer, "");
    if (key in index) {
      index[key] = -1; // Mark this line as occurring twice
    } else {
      index[key] = i;
    }
  }

  // A place to put comments that come _before_ the lines they are
  // anchored to:
  const jsonPrefix: Record<string, string> = {};
  for (const comment of comments) {
    // First if we can find the line the comment was on, that is
    // the most reliable locator:
    let key = comment.on.replace(canonicalizer, "");
    if (key && index[key] !== undefined && index[key] >= 0) {
      jsonLines[index[key]] += " " + comment.content;
      continue;
    }
    // Next, if it's not before anything, it must have been at the very end:
    if (comment.before === undefined) {
      jsonLines[jsonLines.length - 1] += comment.whitespace + comment.content;
      continue;
    }
    // Next, try to put it before something; note the comment extractor
    // used the convention that position 0 is before the first line:
    let location = comment.lineNumber === 0 ? 0 : -1;
    if (location < 0) {
      key = comment.before.replace(canonicalizer, "");
      if (key && index[key] !== undefined) {
        location = index[key];
      }
    }
    if (location >= 0) {
      if (jsonPrefix[location]) {
        jsonPrefix[location] += " " + comment.content;
      } else {
        const inlineWhitespace = comment.whitespace.startsWith("\n")
          ? comment.whitespace.slice(1)
          : comment.whitespace;
        jsonPrefix[location] = inlineWhitespace + comment.content;
      }
      continue;
    }
    // The last definite indicator we can use is that it is after something:
    if (comment.after) {
      key = comment.after.replace(canonicalizer, "");
      if (key && index[key] !== undefined && index[key] >= 0) {
        jsonLines[index[key]] += comment.whitespace + comment.content;
        continue;
      }
    }
    // Finally, try to get it in the right general location by using the
    // line number, but warn the user the comment may have been relocated:
    location = comment.lineNumber - 1; // 0 was handled above
    let separator = " ";
    if (location >= jsonLines.length) {
      location = jsonLines.length - 1;
      separator = "\n";
    }
    jsonLines[location] +=
      separator +
      comment.content +
      " /* [comment possibly relocated by pnpm] */";
  }
  // Insert the accumulated prefixes:
  for (let i = 0; i < jsonLines.length; ++i) {
    if (jsonPrefix[i]) {
      jsonLines[i] = jsonPrefix[i] + "\n" + jsonLines[i];
    }
  }
  // And reassemble the manifest:
  return jsonLines.join("\n");
}
