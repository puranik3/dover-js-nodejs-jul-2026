import fs from 'node:fs/promises';
import path from 'node:path';

const filePath = path.join( './persons.json' );

const persons = [
    {
        name: 'John',
        age: 32
    },
    {
        name: 'Jane',
        age: 28
    }
];

const personsJson = JSON.stringify( persons, null, 4 );

(async () => {
    try {
        await fs.writeFile(
            filePath,
            personsJson,
            { encoding: 'utf-8' }, // EXPLORE: appending to the file etc.
        );
        console.log( 'successfully written to file' );
    } catch( error ) {
        console.log( error.message );
    }
})();

