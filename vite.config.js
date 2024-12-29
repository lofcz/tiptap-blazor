import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'

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
                }
            }
        },
        cssCodeSplit: false,
        emptyOutDir: false
    }
})
