// fs -> filesystem
import fs from 'node:fs';
import path from 'node:path';

// safe path constructions across platforms
const readmeFilePath = path.join('../..', 'README.md');

// async non-blocking
fs.readFile(
    readmeFilePath,
    { encoding: 'utf-8' },
    ( error, contents ) => {
        // case 1. error
        if ( error ) {
            console.log( error.message );
            return;
        }

        // case 2. success
        console.log( contents ); // we get buffer object if no encoding is specified - raw bytes
        // console.log( contents.toString('utf-8') );
    }
);

console.log( 'last line of script' );