/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const resolveFfmpegPlugin = {
  name: "resolveFfmpeg",
  setup(build: any) {
    build.onResolve({ filter: /lib-cov\/fluent-ffmpeg/ }, (args: any) => {
      // fix https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/573
      const actualPath = path.join(args.resolveDir, "lib", "fluent-ffmpeg.js");
      return { path: actualPath };
    });
  },
};

require("esbuild")
  .build({
    entryPoints: ["."],
    bundle: true,
    platform: "node",
    outfile: "./build/output.js",
    plugins: [resolveFfmpegPlugin],
  })
  .catch(() => process.exit(1));
