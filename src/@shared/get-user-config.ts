import type { Uri } from "vscode";
import { workspace } from "vscode";

export function getConfig(uri?: Uri) {
  const config = workspace.getConfiguration("json5", uri);
  if (!workspace.isTrusted) {
    const newConfig = {
      ...config,
    };
    return newConfig;
  }
  return config;
}
