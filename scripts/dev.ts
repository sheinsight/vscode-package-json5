import esbuild from "esbuild";
import { baseConfig } from "./base.config";

esbuild.buildSync({
  ...baseConfig,
  minify: false,
  sourcemap: true,
});
