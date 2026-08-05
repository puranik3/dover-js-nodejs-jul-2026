// fs -> filesystem
import fs from 'node:fs';
import path from 'node:path';

// safe path constructions across platforms
const readmeFilePath = path.join('../..', 'README.md');

// readFileSync() is a synchronous method (sync)
// it completes reading the files, and only then releases control
// IMPORTANT TAKEAWAY: Avoid Sync methods. ALWAYS use async methods.
try {
    const contents = fs.readFileSync(
        readmeFilePath,
        { encoding: 'utf-8' }
    );
    console.log( contents );
} catch( error ) {
    console.log( error.message );
}

// Logged AFTER the contents are logged
console.log( 'last line of script' );