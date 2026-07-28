function foo() {
    console.log( 'I am foo' );

    // `bar` function is local to `foo` - we can use it inside foo
    // `bar` function is local, and is created when `foo` start executes
    function bar() {
        console.log( 'I am bar' );
    }

    bar();

    // we CAN return functions
    return bar;
}

const car = foo(); // car = bar
// bar(); // error -> bar is local to foo

car();