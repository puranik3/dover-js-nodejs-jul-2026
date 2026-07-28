// We say a function creates a "closures" -> it "closes upon" / "captures" the variables in its outer function
function foo( x ) {
    function bar( y ) {
        console.log( x, y ); // inner function scope includes outer function's variables -> we CAN USE x
    }

    bar( 20 );

    return bar;
}

// USUALLY in a language: x is in memory as long as a function executes (foo executes). AFTER the function executes completely (foo executes completely), the variable x is no longer in memory.
// In JS: x is in memory as long as some function needs it (so it could exist AFTER foo executes)

const car = foo( 10 );
car( 30 ); // does this throw an error (BECAUSE x does not exist??)

// EXPLORE: How can closure be used to emulate a set of "private" properties / variables for an object
