let john = null; // good to assign null once you don't plan to use a variable
let x; // undefined

console.log( typeof undefined ); // "undefined"
console.log( typeof null ); // "object"

let jane = {
    name: 'Jane',
    age: 32
};

if( typeof jane === "object" ) {
    console.log( "This is an object and let me manipulate it" );
    ++jane.age; // does not throw an error because jane is not null, but would if jane is null
}

jane = null;

// Make sure you include null check before operating on an object
if( jane !== null && typeof jane === "object" ) {
    console.log( "This is an object and let me manipulate it" );
    ++jane.age; // throws an error because jane is null
}


