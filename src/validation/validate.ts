import type { TextDocument, DiagnosticCollection } from "vscode";
import { languages, workspace, Disposable } from "vscode";
import {
  EXTENSION_DIAGNOSTIC_NAME,
  LANGUAGE_ID,
} from "vs-json5/@shared/constant";
import { json5Lint } from "./json5-lint";

export class JSON5Validation {
  private diagnosticCollection: DiagnosticCollection;
  private subscriptions: Disposable[];
  constructor() {
    this.diagnosticCollection = languages.createDiagnosticCollection(
      EXTENSION_DIAGNOSTIC_NAME
    );

    this.subscriptions = [];

    this.initListen();
  }

  public getDisposables = () => {
    return Disposable.from(...this.subscriptions);
  };

  private initListen = () => {
    this.subscriptions.push(
      workspace.onDidCloseTextDocument((document) => {
        this.diagnosticCollection.delete(document.uri);
      }),
      workspace.onDidOpenTextDocument((document) => {
        this.doValidation(document);
      }),
      workspace.onDidChangeTextDocument((event) => {
        this.doValidation(event.document);
      })
    );
  };

  private setDiagnosticCollection = (document: TextDocument) => {
    if (document.languageId !== LANGUAGE_ID) {
      return;
    }
    const diagnostics = json5Lint(document);
    this.diagnosticCollection.set(document.uri, diagnostics || []);
  };

  public doValidation = (document?: TextDocument) => {
    if (document) {
      this.setDiagnosticCollection(document);
      return;
    }

    for (const document of workspace.textDocuments) {
      this.setDiagnosticCollection(document);
    }
  };
}

export const addJSON5Validation = () => {
  const validation = new JSON5Validation();
  validation.doValidation();
  return validation.getDisposables();
};
