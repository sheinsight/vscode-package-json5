import type { BuildOptions } from "esbuild";
import path from "path";

export const baseConfig: BuildOptions = {
  entryPoints: ["./src/index.ts"],
  platform: "node",
  external: ["vscode"],
  outfile: "dist/index.js",
  format: "cjs",
  bundle: true,
  alias: {
    "vs-json5": path.resolve(__dirname, "../", "src"),
    "json5-parser": require.resolve("json5-parser/lib/esm/main"),
  },
};
