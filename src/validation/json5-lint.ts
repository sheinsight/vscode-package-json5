import {
  type Diagnostic,
  type TextDocument,
  DiagnosticSeverity,
  Range,
} from "vscode";
import type { JSON5SyntaxError } from "vs-json5/@types";
import Ajv from "ajv";
import jju from "jju";
import { NPM_PACKAGE_FILE_NAME } from "vs-json5/@shared/constant";
import { packageSchema } from "vs-json5/schema/npm.package";
import { parseTree, findNodeAtLocation } from "json5-parser";
import { getDiagnosticByLintError } from "vs-json5/@shared/diagnostic";

const ajv = new Ajv({
  strict: false,
});

const jsonSchemaValidate = ajv.compile(packageSchema);

export const json5Lint = (document: TextDocument): Diagnostic[] | void => {
  try {
    const text = document.getText();
    // continue if json5 parse noraml
    jju.parse(text);

    // npm package json schema validate only form package.json5 file
    if (!document.fileName.endsWith(`/${NPM_PACKAGE_FILE_NAME}`)) {
      return;
    }

    // use ajv to validate json schema
    const valid = jsonSchemaValidate(jju.parse(text));
    if (valid) {
      return [];
    }

    const { errors } = jsonSchemaValidate;

    return (errors || []).map((e) => {
      //  the current json5 node of diagnostic warning
      const node = findNodeAtLocation(
        parseTree(text),
        e.instancePath.split("/").filter(Boolean)
      );

      return {
        severity: DiagnosticSeverity.Warning,
        message: e.message!,
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
