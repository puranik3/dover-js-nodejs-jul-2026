// Functions are "first-class" citizens in JavaScript - they can be used wherever normal primitive values or objects can be used
const hello = function() {
    console.log( 'Hello, world' );
};
hello();

const hi = hello; // NOTE: We are not calling hello, we are simply assigning hello function to hi variable
hi();

// FACT: Functions ARE objects in JS - you can add normal properties AND methods on functions
// ...add a normal property
hello.myName = "My name is Hello. I am a function!";

console.log( hello.myName );

// ...add a method
hello.describe = function() {
    console.log( 'I am a function' );
};

hello.describe();