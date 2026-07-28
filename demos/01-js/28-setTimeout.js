setTimeout(
    () => {
        console.log( 1.1 );

        setTimeout(
            () => {
                console.log( 1.2 );
            },
            1000
        )
    },
    0
);

console.log( 2 );

// What is the order and time when numbers are printed?
// (immediate) 2 1.1       (after 1 second) 1.2