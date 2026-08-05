// fs -> filesystem
import fs from 'node:fs/promises';
import path from 'node:path';

// safe path constructions across platforms
const readmeFilePath = path.join('../..', 'READM.md');

// async non-blocking
// (fn_expression)() -> IIFE syntax - defines and calls the function immediately
(async () => {
    try {
        console.log( '---' );
        
        const contents = await fs.readFile(
            readmeFilePath,
            { encoding: 'utf-8' }
        );
        console.log( contents );
    } catch( error ) {
        console.log( error.message );
    }
})();

console.log( 'last line of script' );