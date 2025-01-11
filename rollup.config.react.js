import { readFileSync } from 'fs';

const copyReactPlugin = {
    name: 'copy-react',
    buildStart() {
        const reactContent = readFileSync('node_modules/umd-react/dist/react.production.min.js', 'utf8');
        const reactDomContent = readFileSync('node_modules/umd-react/dist/react-dom.production.min.js', 'utf8');

        this.emitFile({
            type: 'asset',
            fileName: 'react.production.min.js',
            source: reactContent
        });

        this.emitFile({
            type: 'asset',
            fileName: 'react-dom.production.min.js',
            source: reactDomContent
        });
    }
};

export default {
    input: 'virtual',
    output: {
        dir: 'dist'
    },
    plugins: [
        {
            name: 'virtual',
            resolveId(id) {
                if (id === 'virtual') return id;
            },
            load(id) {
                if (id === 'virtual') return 'export default {}';
            }
        },
        copyReactPlugin
    ]
};