import * as esbuild from "esbuild";

const ctx = await esbuild.context({
	bundle: true,
	platform: "node",
	format: "cjs",
	entryPoints: ["./src/index.ts"],
	outfile: "./dist/index.cjs",
});

await ctx.watch();
