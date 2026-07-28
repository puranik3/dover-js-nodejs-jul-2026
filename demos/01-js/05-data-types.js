// primtive data type in JS?
// number (every number is stored as floating point - 64 bits)
// boolean
// string
// null
// undefined
let x = 1, y = 1_000;
let PI = 3.14;

console.log( 'x = ', x );
console.log( 'y = ', y );
console.log( 'PI = ', PI );

console.log( typeof x ); // "number"
console.log( typeof 100 ); // "number"
console.log( typeof PI ); // "number"

console.log( ( 0.1 + 0.2 ) == 0.3 );
console.log( 0.1 + 0.2 );

// string
let message = "Hello, world";
console.log( 'message = ', message );
console.log( 'message[0] =', message[0] );
console.log( 'message[11] =', message[11] );
console.log( 'typeof message[11] = ', typeof message[11] );

console.log( 'message[12] =', message[12] );  // undefined

if ( message[12] === undefined ) {
    console.log( 'Out of bounds' );
}

console.log( 'message.length =', message.length );

// boolean
let isRaining = true;
console.log( 'isRaining = ', isRaining );
console.log( '!isRaining = ', !isRaining );

// Others: big_integer, Symbol


