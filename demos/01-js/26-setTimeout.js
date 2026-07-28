setTimeout(
    () => console.log( 1 ),
    2000
);

setTimeout(
    () => console.log( 2 ),
    1000
);

// What is the order and time when numbers are printed?
// (after 1 second) 2    (after 2 seconds) 1