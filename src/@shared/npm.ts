import { workspace } from "vscode";
import which from "which";

export const canRunNpmInCurrentWorkspace = () => {
  if (workspace.workspaceFolders) {
    return workspace.workspaceFolders.some((f) => f.uri.scheme === "file");
  }
  return false;
};

export const getNPMCommandPath = async (): Promise<string | undefined> => {
  if (workspace.isTrusted && canRunNpmInCurrentWorkspace()) {
    try {
      return await which(process.platform === "win32" ? "npm.cmd" : "npm");
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
};
