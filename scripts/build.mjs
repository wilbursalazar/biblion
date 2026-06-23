import { builtinModules } from "node:module";
import esbuild from "esbuild";

const prod = process.argv.includes("--prod");
const nodeBuiltins = builtinModules.flatMap((moduleName) =>
  moduleName.startsWith("node:")
    ? [moduleName]
    : [moduleName, `node:${moduleName}`],
);

await esbuild.build({
  banner: {
    js: "/* Biblion - bundled for Obsidian */",
  },
  bundle: true,
  entryPoints: ["src/main.ts"],
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...nodeBuiltins,
  ],
  format: "cjs",
  logLevel: "info",
  minify: prod,
  outfile: "main.js",
  platform: "browser",
  sourcemap: prod ? false : "inline",
  target: "es2022",
});
