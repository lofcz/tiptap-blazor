import {defineConfig} from 'vite'

export default defineConfig({
    server: {
        open: 'src/test.html'
    },
    build: {
        emptyOutDir: false
    }
})
