// HIGHER ORDER FUNCTION (HoF): A function that accepts a function as an argument, or returns a function
// sumAsync is HoF
function sumAsync( x, y, callback ) {
    setTimeout(
        () => { // Node JS calls this function after >= 3 seconds, and it gets the returned value
            // return x + y; // No point returning the result to Node JS
            callback( x + y );
        },
        3000
    );

    // return undefined;
}

// Question: How can we modify the sumAsync() function, so that the code below (with some modifications) can obtain the result and do something with it?
// Answer: We can pass a function to sumAsync. sumAsync calls this function and passes the result once it is computed.
/*const result = */sumAsync(
    12,
    13,
    ( result ) => {
        console.log( `result = ${result}` );

        const squareResult = result * result;
        console.log( `square of result = ${squareResult}` )
    }
);

// console.log( 'result =', result );

// (immediately) result = undefined