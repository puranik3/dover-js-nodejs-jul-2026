// TAKEAWAY: 
// streamed read and write
import fs from 'node:fs';
import path from 'node:path';

const readmeFilePath = path.join('./08-streaming-sample.wav');

// rs -> read stream object - this is an event emitter
// starts reading the file...
const rs = fs.createReadStream( readmeFilePath, { encoding: 'utf-8' } );

let count = 1;

// chunk is 64KB (default) -> you can change it
rs.on(
    'data',
    ( chunk ) => {
        console.log( 'chunk ' + count );
        ++count;
        // console.log( chunk );
    }
);