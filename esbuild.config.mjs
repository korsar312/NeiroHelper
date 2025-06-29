import {build} from "esbuild";
import clean from "esbuild-plugin-clean";

const format = 'cjs'

build({
    entryPoints: ["Start.ts"],
    bundle: true,
    platform: "node",
    format: format,
    target: ["node20"],
    outfile: `bot.${format}`,
    sourcemap: false,
    plugins: [
        clean({patterns: [`/bot.${format}`]})
    ]
}).catch(() => process.exit(1));