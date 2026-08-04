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

// we call async code as though it gives the results immediately (i.e. as though it is sync)
// async function doAll() { ... }
const doAll = async () => {
    try {
        const result1 = await sumAsync( 12, 13 );
        console.log( 'result1 = ', result1 );

        const result2 = await sumAsync( result1, 14 );
        console.log( 'result2 = ', result2 );

        const result3 = await sumAsync( result2, 15 );
        console.log( 'result3 = ', result3 );
    } catch( error ) {
        console.log( error.message );
    }
}

doAll();

console.log( 'Other code continues executing...' );