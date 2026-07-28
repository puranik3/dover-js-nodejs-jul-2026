function sumAsync( x, y ) {
    setTimeout(
        () => {
            return x + y;
        },
        3000
    );

    // return undefined;
}

// How can we modify the sumAsync() function, so that the code below (with some modifications) can obtain the result and do something with it?
const result = sumAsync( 12, 13 );
console.log( 'result =', result );

// (immediately) result = undefined