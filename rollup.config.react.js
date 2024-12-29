import { readFileSync } from 'fs';
import { minify } from 'terser';

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

async function minifyContent(content) {
    const result = await minify(content, terserConfig);
    return result.code;
}

const reactPlugin = {
    name: 'react-copy',
    async buildStart() {
        const reactContent = readFileSync('./node_modules/react/umd/react.production.min.js', 'utf8');
        const reactDomContent = readFileSync('./node_modules/react-dom/umd/react-dom.production.min.js', 'utf8');

        const minifiedReact = await minifyContent(reactContent);
        const minifiedReactDom = await minifyContent(reactDomContent);

        this.emitFile({
            type: 'asset',
            fileName: 'react.production.min.js',
            source: `/*! react.production.min.js v${version} */\n${minifiedReact}`
        });

        this.emitFile({
            type: 'asset',
            fileName: 'react-dom.production.min.js',
            source: `/*! react-dom.production.min.js v${version} */\n${minifiedReactDom}`
        });
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
