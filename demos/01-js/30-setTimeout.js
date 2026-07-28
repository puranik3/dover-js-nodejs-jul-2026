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
    1000
);

setTimeout(
    () => console.log( 2 ),
    2000
);

// What is the order and time when numbers are printed?
// (after 1 second) 1.1     (after 2 seconds) 2 1.2