// spread -> ...
// spread operator is overloaded with the rest operator
// spread operator is used to copy array items, and object properties

// copy array items
const arr1 = [ 1, 2, 3 ], arr2 = [ 4, 5, 6 ];

console.log( Math.max( 4, 8, 6 ) );
console.log( Math.max( arr1 ) ); // can't pass a array
console.log( Math.max( ...arr1 ) ); // pass the array items as comma-separated arguments - Math.max( 1, 2, 3 ) - check how you can make this work

const arr3 = [
    ...arr1,
    ...arr2
];

console.log( arr3 ); // [ 1, 2, 3, 4, 5, 6 ]

const arr1_copy1 = arr1; // DOES NOT CREATE a new array
const arr1_copy2 = [ ...arr1 ]; // CREATE A new array

// Are these doing the same thing?
console.log( 'arr1_copy1 = ', arr1_copy1 );
console.log( 'arr1_copy2 = ', arr1_copy2 );

arr1_copy1[0] = 10; // affects arr1
arr1_copy2[1] = 20; // DOES NOT affect arr1

console.log( 'arr1 = ', arr1 ); // [ 10, 2, 3 ]