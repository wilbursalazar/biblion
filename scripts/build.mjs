import builtins from "builtin-modules";
import esbuild from "esbuild";

const prod = process.argv.includes("--prod");

await esbuild.build({
  banner: {
    js: "/* Bible Verse Expander - bundled for Obsidian */",
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
    ...builtins,
  ],
  format: "cjs",
  logLevel: "info",
  minify: prod,
  outfile: "main.js",
  platform: "browser",
  sourcemap: prod ? false : "inline",
  target: "es2022",
});
