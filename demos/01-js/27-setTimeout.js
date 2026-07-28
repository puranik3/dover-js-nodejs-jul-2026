// f enters the queue immediately, but still has to wait till remaining code executes and runtime is free
setTimeout(
    () => console.log( 1 ), // f
    0
);

console.log( 2 );

// What is the order and time when numbers are printed?
// (immediately) 2 1