import {
  type Diagnostic,
  type TextDocument,
  DiagnosticSeverity,
  Range,
} from "vscode";
import type { JSON5SyntaxError, Pointer } from "vs-json5/@types";
import { Draft07 } from "json-schema-library";
import jju from "jju";
import { NPM_PACKAGE_FILE_NAME } from "vs-json5/@shared/constant";
import { resolvePoiniterToPath } from "vs-json5/@shared";
import { packageSchema } from "vs-json5/schema/npm.package";
import { parseTree, findNodeAtLocation } from "json5-parser";
import { getDiagnosticByLintError } from "vs-json5/@shared/diagnostic";

const jsonSchema = new Draft07(packageSchema);

export const json5Lint = (document: TextDocument): Diagnostic[] => {
  try {
    const text = document.getText();
    // continue if json5 parse noraml
    jju.parse(text);

    // npm package json schema validate only form package.json5 file
    if (!document.fileName.endsWith(`/${NPM_PACKAGE_FILE_NAME}`)) {
      return [];
    }

    //  validate json schema
    const errors = jsonSchema.validate(jju.parse(text));
    if (errors.length === 0) {
      return [];
    }

    return (errors || []).map((e) => {
      //  the current json5 node of diagnostic warning
      const node = findNodeAtLocation(
        parseTree(text),
        resolvePoiniterToPath(e.data.pointer as Pointer).split("/")
      );

      return {
        severity: DiagnosticSeverity.Warning,
        message: e.message,
        range: new Range(
          document.positionAt(node?.offset!),
          document.positionAt(node?.offset! + node?.length!)
        ),
      };
    });
  } catch (e) {
    //  catch json parse error
    return getDiagnosticByLintError(e as JSON5SyntaxError, document);
  }
};
