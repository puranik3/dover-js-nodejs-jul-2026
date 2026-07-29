/**
 * Given the following snippet of code, solve the questions that follow
 * const numbers = [ 5, 11, 13, 7, 2, 31, 3, 19, 23, 17, 29 ];
    • Sort the numbers in the array in increasing order and print the array
    • Sort the array in decreasing order and print the array
    • Add the number 37 to the end of the array using push()
    • Remove the last 2 numbers in the array
    • Remove the numbers at indices 3, 4 (i.e. the 4th and 5th numbers) and insert the strings 'Seven' and 'Eleven' in their place.
    • Use indexOf() to check if 23 belongs to the array or not. Also, check if 41 belongs to the array or not.
 */
const numbers = [ 5, 11, 13, 7, 2, 31, 3, 19, 23, 17, 29 ];

// 1. Sort the numbers in the array in increasing order and print the array
numbers.sort(
    ( x, y ) => {
        // if ( x < y ) {
        //     return -1; // or any -ve number
        // }

        // if ( x > y ) {
        //     return 1; // any +ve number
        // }

        // if ( x === y ) {
        //     return 0;
        // }

        return x - y;
    }
);
console.log( numbers );

// 2. Sort the array in decreasing order and print the array
numbers.sort(
    ( x, y ) => y - x
);
console.log( numbers );

// 3. Add the number 37 to the end of the array using push()
// Let us sort is ascending order again before proceeding...
numbers.sort(
    ( x, y ) => x - y
);
numbers.push( 37 );
console.log( numbers );

// 4. Remove the last 2 numbers in the array
numbers.pop();
numbers.pop();
console.log( numbers );

// 5. Remove the numbers at indices 3, 4 (i.e. the 4th and 5th numbers) and insert the strings 'Seven' and 'Eleven' in their place.
numbers.splice( 3, 2, 'Seven', 'Eleven' );
console.log( numbers );

// 6. Use indexOf() to check if 23 belongs to the array or not. Also, check if 41 belongs to the array or not.
let idx;
console.log( `first index of 23 is ${numbers.indexOf( 23 )}` ); // 8
console.log( `first index of 41 is ${numbers.indexOf( 41 )}` ); // -1 (NOT FOUND)

// Explore: slice()