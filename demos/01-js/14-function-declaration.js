console.log( sum1( 12, 13 ) ); // sum1 exists and the code runs

// Syntax 1
// This kind of function is created BEFORE the code runs
function sum1( x, y ) {
    console.log( `Received ${x}, ${y}` );
    return x + y;
}

// console.log( sum2( 12, 13 ) ); // sum2 does not exist at this point in time - THIS WILL NOT WORK

// Syntax 2
// Function expression (RHS of the assignment)
// This kind of function is created WHEN the code runs
const sum2 = function( x, y ) {
    console.log( `Received ${x}, ${y}` );
    return x + y;
};

console.log( sum2( 12, 13 ) ); // works!

// Explore: "Hoisting"

// console.log( sum3( 12, 13 ) ); // sum3 does not exist at this point in time - THIS WILL NOT WORK

// Syntax 3
// Arrow functions (ES2015) - Syntax
const sum3 = ( x, y ) => {
    console.log( `Received ${x}, ${y}` );
    return x + y;
};

console.log( sum3( 12, 13 ) ); // works!

// For a function that has only 1 line with a return statement - we can OMIT {} AND return together
// const sum4 = ( x, y ) => {
//     return x + y;
// }
const sum4 = ( x, y ) => { x + y }; // NO return -> undefined is returned by default
console.log( sum4( 12, 13 ) ); // undefined

const sum5 = ( x, y ) => x + y; // we omitted {} and return. Hence the RHS is returned
console.log( sum5( 12, 13 ) ); // 25

// If the function has EXACTLY 1 argument
const square = x => x * x;
console.log( square( 12 ) );

// Explore: Immediately Invoked Function Expressions (IIFE)
// Explore: The arguments object
