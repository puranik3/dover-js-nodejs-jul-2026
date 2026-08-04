function sumAsync( x, y ) {
    return new Promise(
        ( resolve, reject ) => {
            setTimeout(
                () => {
                    if ( typeof x !== 'number' || typeof y !== 'number' ) {
                        reject( new Error( 'at least one argument was not a number' ) );
                        return;
                    }

                    resolve( x + y );
                },
                3000
            );
        }
    );
}

// What is returned by doAll()?
// async function will ALWAYS return a promise
const doAll = async () => {
    try {
        console.log(2);
        // Hey JS runtime! I know this is going to take some time. I give up control.
        const result1 = await sumAsync( 12, 13 );
        console.log(3);
        console.log( 'result1 = ', result1 );

        // again gives up control
        const result2 = await sumAsync( result1, 14 );
        console.log( 'result2 = ', result2 );

        // again gives up control
        const result3 = await sumAsync( result2, 15 );
        console.log( 'result3 = ', result3 );
    } catch( error ) {
        console.log( error.message );
    }

    // return undefined
    return "done"; // the resolved value for the promise returned by the async function doAll()
}

console.log(1);

doAll()
    .then(finalResult => {
        console.log( finalResult );
    });

console.log( 'Other code continues executing...' );
console.log(4);

for ( let i = 0; i < 1e10; ++i ) {
    ;
}

// ANSWER: 1 (t=0) - 2 (t=0) - 4 (t=0) - 3 (t=3)