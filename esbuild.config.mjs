import {build} from "esbuild";
import clean from "esbuild-plugin-clean";
import copy from "esbuild-plugin-copy";

const format = 'cjs'

build({
    entryPoints: ["Start.ts"],

    bundle: true,
    platform: "node",
    target: ["node20"],

    entryNames: 'bot',
    format: format,
    outExtension: { '.js': '.cjs' },
    outdir: 'build',

    loader: {
        '.node': 'copy'
    },

    assetNames: '[name]',

    plugins: [
        clean({patterns: [`build`]}),
        copy({assets: [{ from: 'node_modules/better-sqlite3/build/Release/*.node', to: './' }]})
    ]
}).catch(() => process.exit(1));

