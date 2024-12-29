import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { minify } from 'terser';

// Načteme verzi
const pkg = JSON.parse(readFileSync('./node_modules/react/package.json'));
const version = pkg.version;

// Terser konfigurace
const terserConfig = {
    compress: false,  // vypneme kompresi
    mangle: false,    // vypneme mangling
    format: {
        comments: false,
        ascii_only: true
    }
};


// Asynchronní funkce pro minifikaci
async function minifyContent(content) {
    const result = await minify(content, terserConfig);
    return result.code;
}

// Hlavní async IIFE
(async () => {
    try {
        // Přečteme existující UMD soubory
        const reactContent = readFileSync('./node_modules/react/umd/react.production.min.js', 'utf8');
        const reactDomContent = readFileSync('./node_modules/react-dom/umd/react-dom.production.min.js', 'utf8');

        // Minifikujeme obsah
        const minifiedReact = await minifyContent(reactContent);
        const minifiedReactDom = await minifyContent(reactDomContent);

        // Zapíšeme je s bannerem
        writeFileSync('./dist/react.production.min.js',
            `/*! react.production.min.js v${version} */\n${minifiedReact}`);
        writeFileSync('./dist/react-dom.production.min.js',
            `/*! react-dom.production.min.js v${version} */\n${minifiedReactDom}`);

        console.log('React files processed and minified successfully');
    } catch (error) {
        console.error('Error processing files:', error);
        process.exit(1);
    }
})();

// Vytvoříme virtuální plugin
const virtualPlugin = {
    name: 'virtual',
    resolveId(id) {
        if (id === 'virtual-module') return id;
        return null;
    },
    load(id) {
        if (id === 'virtual-module') return 'export default {}';
        return null;
    }
};

// Plugin pro smazání empty.js
const cleanupPlugin = {
    name: 'cleanup',
    closeBundle() {
        try {
            unlinkSync('./dist/empty.js');
        } catch (err) {
            console.error('Error deleting empty.js:', err);
        }
    }
};

export default {
    input: 'virtual-module',
    output: {
        file: 'dist/empty.js',
        format: 'es'
    },
    plugins: [virtualPlugin, cleanupPlugin]
};
