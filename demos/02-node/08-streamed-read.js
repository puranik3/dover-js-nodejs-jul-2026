// TAKEAWAY: Streamed read/write helps reduce memory needs by avoiding reading/writing contents in one shot
import fs from 'node:fs';
import path from 'node:path';

const readmeFilePath = path.join('./08-streaming-sample.wv');

// rs -> read stream object - this is an event emitter
// starts reading the file...
const rs = fs.createReadStream( readmeFilePath, { encoding: 'utf-8' } );

let count = 1;

// chunk is 64KB (default) -> you can change it
rs.on(
    'data', // event emitted after every chunk is read (called multiple times)
    ( chunk ) => {
        console.log( 'chunk ' + count );
        ++count;
        // console.log( chunk );
    }
);

// the event emitted AFTER file has been read completely
rs.on( 'end', () => console.log( 'file has been read' ) );

// the event emitted when an error occurs
rs.on( 'error', ( error ) => console.log( error.message ) );