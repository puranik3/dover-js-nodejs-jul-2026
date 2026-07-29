function greet( message = 'Hello', name = 'Dover' ) {
    console.log( `${message} ${name}!` );
}

greet( 'Good morning', 'John' );
greet( 'Good morning' );
greet();
greet( undefined, 'John' ); // Hello John