import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["server/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "dist-backend/labdeck-backend.cjs",
  format: "cjs",
});
