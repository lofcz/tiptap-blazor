import { existsSync, mkdirSync } from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const requiredFiles = [
    'react.production.min.js',
    'react-dom.production.min.js'
];

const distPath = join(__dirname, '..', 'dist');

async function checkAndBuildReact() {

    if (!existsSync(distPath)) {
        mkdirSync(distPath, { recursive: true });
    }

    const missingFiles = requiredFiles.filter(file =>
        !existsSync(join(distPath, file))
    );

    if (missingFiles.length > 0) {
        console.log('copying react dist files');
        try {
            await execAsync('npm run build-react');
        } catch (error) {
            console.error('Error copying react dist files:', error);
            process.exit(1);
        }
    } else {
        console.log('react dist files are ready');
    }
}

checkAndBuildReact().catch(error => {
    console.error('unexpected error:', error);
    process.exit(1);
});
