import esbuild from "esbuild";

await esbuild.build({
  bundle: true,
  entryPoints: ["src/verse.ts"],
  format: "esm",
  logLevel: "silent",
  outfile: "dist/verse-test.mjs",
  platform: "node",
  target: "es2022",
});
