// rest operator
// Function should be able to handle multiple number of arguments
// ... -> rest operator
// y is called the rest parameter and WILL be ALWAYS an array
function foo( x, ...y ) {
    console.log( x, y );
}

foo( 10, 20, 30, 40, 50 ); // x = 10, y = [ 20, 30, 40, 50 ]

// Write a function that adds up all the numbers passed to it and returns the sum
function sumAll( ...nums ) {
    let sum = 0;

    for ( let i = 0; i < nums.length; ++i ) {
        sum += nums[i];
    }

    return sum;
}

console.log( sumAll( 10, 20, 30, 40 ) ); // 100

// Function to find the sum of squares of the numbers
// Write a function that adds up all the numbers passed to it and returns the sum
function sumSquares( ...nums ) {
    let sum = 0;

    for ( let i = 0; i < nums.length; ++i ) {
        sum += nums[i] * nums[i];
    }

    return sum;
}

console.log( sumSquares( 10, 20, 30, 40 ) ); // 3000

function sumCubes( ...nums ) {
    let sum = 0;

    for ( let i = 0; i < nums.length; ++i ) {
        sum += nums[i] * nums[i] * nums[i];
    }

    return sum;
}

console.log( sumCubes( 10, 20, 30, 40 ) ); // 100000

function sumLogs( ...nums ) {
    let sum = 0;

    for ( let i = 0; i < nums.length; ++i ) {
        sum += Math.log( nums[i] );
    }

    return sum;
}

console.log( sumLogs( 10, 20, 30, 40 ) ); // 12.388394202324129

/**
 * Transforms the items in the `nums` array using `action`, sums up the transformed values, and returns the sum
 * @param {function} action A function that transforms an item in nums array
 * @param  {...any} nums An array of numbers
 * @returns The sum of the transformed items
 */
function sum( action, ...nums ) {
    let sum = 0;

    for ( let i = 0; i < nums.length; ++i ) {
        sum += action( nums[i] );
    }

    return sum;
}

const fourthPower = num => num ** 4;

console.log( sum( fourthPower, 10, 20, 30, 40 ) ); // action = fourthPower
console.log( sum( Math.log, 10, 20, 30, 40 ) );
console.log( sum( x => x * x * x, 10, 20, 30, 40 ) );
console.log( sum( Math.sqrt, 10, 20, 30, 40 ) );
