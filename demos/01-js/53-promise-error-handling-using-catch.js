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

// It is not necessary to add catch() at the end, but it is very common to do so
sumAsync( 12, 13 )
    .then(
        result1 => {
            console.log( 'first result = ', result1 );

            return sumAsync( result1, 'hello' );
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
    )
    .catch( // when there is an error (rejection) in any of the above async operations
        error => {
            console.log( error.message );
        }
    );

console.log( 'Other code continues executing...' );