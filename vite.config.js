import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    define: {
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    },
    server: {
        open: 'src/index.html'
    },
    plugins: [
        svgr({
            svgrOptions: {
                icon: true,
                dimensions: false
            }
        }),
        react({
            babel: {
                plugins: [
                    ['@babel/plugin-transform-react-jsx', {
                        pragma: 'React.createElement',
                        pragmaFrag: 'React.Fragment'
                    }]
                ]
            }
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/tiptap-island.js'),
            name: 'TipTapIsland',
            formats: ['es', 'umd'],
            fileName: (format) => `tiptap-island.${format}.js`
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react-dom/client'],
            output: {
                globals: {
                    'react': 'React',
                    'react-dom': 'ReactDOM',
                    'react-dom/client': 'ReactDOM'
                },
                chunkFileNames: '[name].js',
                manualChunks: undefined,
                inlineDynamicImports: true,
                assetFileNames: 'tiptap-island[extname]'
            }
        },
        cssCodeSplit: false,
        emptyOutDir: false
    }
})
