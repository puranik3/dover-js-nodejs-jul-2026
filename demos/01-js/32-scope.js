// TAKEAWAY: Limited scope IS BETTER than broader scope
const x = 1;
const x_global = 1;

function outer() {
    const x = 2;
    const outer_1 = 'outer_1'; // local to outer()
    outer_2 = 'outer_2'; // global - BAD - do not do this

    // We use let, and we do not use var for creating variables
    if ( true ) {
        const x = 3;
        let if_1 = 'if_1'; // scoped to the if block
        var if_2 = 'if_2'; // scoped to the outer() function
        console.log( `x = ${x}` ); // 3
    }

    // console.log( `if_1 = ${if_1}` ); // can use only inside if block where it is defined
    console.log( `if_2 = ${if_2}` ); // can use it in outer function even though it is created inside the if block

    function inner() {
        const x = 4;
        const inner_1 = 'inner_1';

        // inner function can use the outer function's variables
        console.log( `outer_2 (inside inner) = ${outer_2}` );
        console.log( `inner x = ${x}` ); // 4
    }

    inner();

    // ERROR: outer function cannot use inner function's variables
    // console.log( `inner_1 (inside outer) = ${inner_1}` );
}

outer();

// console.log( `outer_1 = ${outer_1}` ); // local to outer()
console.log( `outer_2 = ${outer_2}` ); // works!