// var (DO NOT USE)
// let, const - USE these

// x = 1; // global variable - NEVER do this
// console.log( 'x = ', x );

// ALWAYS use one of let / const
let x_let = 1; // can be reassigned (value can be changed)
const x_const = 1; // cannot be reassigned (value cannot be changed) - MUST give initial value

x_let = 2;
++x_let;

console.log( 'x_let = ', x_let );


// x_const = 2; // cannot reassign - this line throws an error
// ++x_const;

// console.log( 'x_const = ', x_const );

const john = {
    name: 'John',
    age: 32
};

// CANNOT assign to const variable
// john = {
//     name: 'Jonathan',
//     age: 33
// };

// This works!
john.name = 'Jonathan';
++john.age;

console.log( 'john =', john );

let unknownValue;
console.log( 'unknownValue =', unknownValue );
console.log( undefined ); // A keyword whose value is undefined

let z = 1;
z = undefined;
console.log( 'z =', z );

// No fixed type for variables
let a = 1;
console.log( 'typeof a =', typeof a );
a = "I am A";
console.log( 'typeof a =', typeof a );
a = [ 1, 2, 3 ];
console.log( 'typeof a = ', typeof a ); // Arrays are just special objects
