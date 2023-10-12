import {
  type Diagnostic,
  type TextDocument,
  DiagnosticSeverity,
  Range,
} from "vscode";
import type { JSON5SyntaxError } from "vs-json5/@types";
import Ajv, { type ErrorObject } from "ajv";
import jju from "jju";
import {
  NPM_PACKAGE_FILE_NAME,
  VALID_VALUES_TIP_START,
} from "vs-json5/@shared/constant";
import { packageSchema } from "vs-json5/schema/npm.package";
import { parseTree, findNodeAtLocation } from "json5-parser";
import { getDiagnosticByLintError } from "vs-json5/@shared/diagnostic";

const ajv = new Ajv({
  strict: false,
});

const jsonSchemaValidate = ajv.compile(packageSchema);

const formatDiagnosticMsg = (
  error: ErrorObject<string, { allowedValues?: string[] }>
) => {
  const { message, params = {} } = error;
  const { allowedValues = [] } = params;
  const allowedValuesMsg =
    "allowedValues" in params
      ? `${VALID_VALUES_TIP_START}: ${allowedValues.join(" , ")}`
      : "";

  return [message, allowedValuesMsg].join("; ");
};

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
        message: formatDiagnosticMsg(e),
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
