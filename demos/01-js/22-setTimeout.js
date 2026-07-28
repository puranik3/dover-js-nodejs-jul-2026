// setTimeout is used to execute a function AFTER a delay
// The runtime (Node JS / browser) executes the function f AFTER delay milliseconds
setTimeout(
    () => console.log( 'hello setTimeout' ), // f
    10000 // delay (in milliseconds)
);

// WITHIN NODE runtime: A timer is set for 10 seconds. Whenever the timer fires, the function is put into a queue (say, array) called "EVENT QUEUE".

// VERY IMPORTANT: JS is a single-threaded environment (the application code runs on a single thread)

// The runtime continues doing what it is currently doing even after 10 seconds
for( let i = 0; i < 1e9; ++i ) {
    for( let j = 0; j < 10; ++j ) {
        ;
    }
}

// Once the above loop executes, the Node JS runtime is FREE! (function call stack is empty)
// The EVENT QUEUE is checked for function waiting to be executed, and they are picked up one-by-one and executed (here, f is executed)
