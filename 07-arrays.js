const a = [ 1, 2, 3 ];

console.log( 'a =', a );
console.log( 'a[0] =', a[0] );
console.log( 'a[3] =', a[3] ); // undefined (NOT out of bounds exception)

++a[0];
a[1] = 20;

a[3] = 4; // works!

a[10] = 4; // works! - there are no items in between

console.log( 'a =', a );

console.log( 'a.length =', a.length );

const b = [ 10, 20, 'Thirty', { name: 'John', age: 32 } ];
console.log( 'b =', b );

console.log( 'b[2][1] =', b[2][1] );
console.log( b[3].age );

// multi-dimensional array?
const matrix = [
    [1, 2, 3 ],
    [4, 5, 6, "Seven", 8 ],
    [9, 10, 11, 12 ]
];

console.log( matrix[1][3] )
console.log( matrix[1][3][2] )

console.log( 'typeof a =', typeof a ); // "object"
console.log( a instanceof Array );

// What is "Array-like object"?