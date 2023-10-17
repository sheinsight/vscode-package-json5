import type { Uri } from "vscode";
import type { JOSNUserSettings } from "vs-json5/@types";
import { workspace } from "vscode";
import { LANGUAGE_ID } from "vs-json5/@shared/constant";

const DEFAUL_SETTINGS: JOSNUserSettings = {
  validate: {
    enable: true,
  },
  format: {
    enable: true,
    singleQuote: false,
    space: 2,
  },
};

export function getUserSettings(uri?: Uri): JOSNUserSettings {
  const config = workspace.getConfiguration(
    LANGUAGE_ID,
    uri
  ) as unknown as JOSNUserSettings;

  if (!workspace.isTrusted) {
    const newConfig = {
      ...DEFAUL_SETTINGS,
      ...config,
    };
    return newConfig;
  }
  return config;
}
