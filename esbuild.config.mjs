import path from 'path';
import { fileURLToPath } from 'url';      // ← добавляем
import { build } from 'esbuild';
import clean from 'esbuild-plugin-clean';
import copy from 'esbuild-plugin-copy';

// В ESM-скопе получаем __dirname таким вот трюком:
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const format = 'cjs';

build({
    entryPoints: ['Start.ts'],
    bundle: true,
    platform: 'node',
    target: ['node20'],
    entryNames: 'bot',
    format,
    outExtension: { '.js': '.cjs' },

    // вот здесь используем path.resolve — больше никакого лишнего «build␣»
    outdir: path.resolve(__dirname, 'build'),

    loader: { '.node': 'copy' },
    assetNames: '[name]',

    plugins: [
        clean({ patterns: ['build'] }),
        copy({
            assets: [
                {
                    from: 'node_modules/better-sqlite3/build/Release/*.node',
                    to: './'
                }
            ]
        })
    ]
}).catch(() => process.exit(1));
