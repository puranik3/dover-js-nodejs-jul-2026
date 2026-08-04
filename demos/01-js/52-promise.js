function sumAsync( x, y ) {
    return new Promise(
        ( resolve, reject ) => { // f
            // console.log( 'f is called' );
            // console.log( typeof a, typeof b );

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

// const p = sumAsync( 12, 13 );

// Hey promise p! When you get the result (successful/resolved value), give me the result
//p.then(

// We generally chain the call to then(), catch() etc.
sumAsync( 12, 13 )
    .then(
        result1 => {
            console.log( 'first result = ', result1 );

            return sumAsync( result1, 14 );
        }
    )
    .then(
        result2 => {
            console.log( 'second result = ', result2 );

            return sumAsync( result2, 15 )
        }
    )
    .then(
        result3 => {
            console.log( 'third result = ', result3 );
        }
    );

console.log( 'Other code continues executing...' );