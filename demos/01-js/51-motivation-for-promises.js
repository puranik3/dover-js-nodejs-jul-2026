// DRAWBACK of callback pattern: The code that does multiple serial asynchronous requests 
// is NOT easy to follow
function sumAsync( x, y, callback ) {
    setTimeout(
        () => callback( x + y ),
        3000
    );
}

// Once the asynchronous operation is complete, let's say we want to do someting else asynchrnously!
sumAsync(
    12,
    13,
    ( result1 ) => {
        console.log( 'The first result is: ', result1 );

        sumAsync(
            result1,
            14,
            ( result2 ) => {
                console.log( 'The second result is: ', result2 );

                sumAsync(
                    result2,
                    15,
                    ( result3 ) => {
                        console.log( 'The third result is: ', result3 );
                    }
                )
            }
        )
    }
);

console.log( 'Other code continues executing...' );