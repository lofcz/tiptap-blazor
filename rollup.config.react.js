import { readFileSync, mkdirSync } from 'fs';
import { minify } from 'terser';
import path from 'path';
import { fileURLToPath } from 'url';
import { rmSync } from 'fs';
import webpack from 'webpack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync('./node_modules/react/package.json'));
const version = pkg.version;

const terserConfig = {
    compress: false,
    mangle: false,
    format: {
        comments: false,
        ascii_only: true
    }
};

async function runWebpack(config) {
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {
                reject(err);
                return;
            }
            if (stats.hasErrors()) {
                reject(new Error(stats.toString()));
                return;
            }
            resolve(stats);
        });
    });
}

const reactPlugin = {
    name: 'react-copy',
    async buildStart() {
        try {
            const tempDir = path.join(__dirname, 'temp');
            const tempDistDir = path.join(__dirname, 'temp-dist');

            rmSync(tempDir, { recursive: true, force: true });
            rmSync(tempDistDir, { recursive: true, force: true });
            mkdirSync(tempDir, { recursive: true });
            mkdirSync(tempDistDir, { recursive: true });

            const commonConfig = {
                mode: 'production',
                optimization: {
                    minimize: false
                },
                resolve: {
                    extensions: ['.js', '.jsx']
                },
                module: {
                    rules: [
                        {
                            test: /\.jsx?$/,
                            exclude: /node_modules/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-react']
                                }
                            }
                        }
                    ]
                }
            };

            // 1. build files
            await runWebpack({
                ...commonConfig,
                entry: 'react',
                output: {
                    path: tempDistDir,
                    filename: 'react.production.min.js',
                    library: 'React',
                    libraryTarget: 'umd',
                    globalObject: 'this'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': JSON.stringify('production')
                    })
                ]
            });

            await runWebpack({
                ...commonConfig,
                entry: 'react-dom',
                externals: {
                    'react': 'React'
                },
                output: {
                    path: tempDistDir,
                    filename: 'react-dom.production.min.js',
                    library: 'ReactDOM',
                    libraryTarget: 'umd',
                    globalObject: 'this'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': JSON.stringify('production')
                    })
                ]
            });

            // 2. minify
            const reactContent = readFileSync(path.join(tempDistDir, 'react.production.min.js'), 'utf8');
            const reactDomContent = readFileSync(path.join(tempDistDir, 'react-dom.production.min.js'), 'utf8');

            const minifiedReact = await minify(reactContent, terserConfig);
            const minifiedReactDom = await minify(reactDomContent, terserConfig);

            // 3. copy built umd files into dist
            this.emitFile({
                type: 'asset',
                fileName: 'react.production.min.js',
                source: `/*! react.production.min.js v${version} */\n${minifiedReact.code}`
            });

            this.emitFile({
                type: 'asset',
                fileName: 'react-dom.production.min.js',
                source: `/*! react-dom.production.min.js v${version} */\n${minifiedReactDom.code}`
            });

            rmSync(tempDir, { recursive: true, force: true });
            rmSync(tempDistDir, { recursive: true, force: true });

        } catch (error) {
            console.error('Error during build:', error);
            throw error;
        }
    }
};

export default {
    input: 'virtual',
    output: {
        dir: 'dist'
    },
    plugins: [{
        name: 'virtual',
        resolveId(id) {
            if (id === 'virtual') return id;
        },
        load(id) {
            if (id === 'virtual') return 'export default {}';
        }
    }, reactPlugin]
};
