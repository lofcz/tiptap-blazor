import { rm } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function cleanDist() {
    const distPath = join(__dirname, '..', 'dist');
    try {
        await rm(distPath, { recursive: true, force: true });
        console.log('Dist folder cleaned successfully');
    } catch (error) {
        console.error('Error cleaning dist folder:', error);
    }
}

await cleanDist();
