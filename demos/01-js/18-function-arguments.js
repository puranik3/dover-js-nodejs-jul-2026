// IMPORTANT: There is no relation between how many arguments a function expects, and how may we pass when calling the function
function foo( x, y ) {
    console.log( arguments );
    console.log( 'arguments.length = ', arguments.length );
    console.log( x, y );

    // By checking the number of arguments, and the data types (typeof / instanceof), you can do different things within the function
    // This is how we implement function overloading in JS
}

foo();
foo( 10 );
foo( 10, 20 );

/**
 * Write a function to book a hotel room
 * It takes name, startDate, endDate. If startDate is omitted, then start date will be current date.
 * It returns a booking object - example, { name: 'Bloom Hotel', startDate: '2026-07-28', endDate: '2026-07-30' }
 *
 * ASIDE:
 * new Date() -> current date
 * new Date( '2026-07-30' ) -> specific date
 */
function bookHotel( name, startOrEndDate, endDate ) {
    let startDate;

    if ( endDate === undefined ) { // Case 1
        startDate = new Date();
        endDate = new Date( startOrEndDate )
    } else { // Case 2
        startDate = new Date( startOrEndDate );
        endDate = new Date( endDate );
    }

    return {
        name,
        startDate,
        endDate
    };
}

console.log( bookHotel( 'Bloom Hotel', '2026-07-30' ) ); // Case 1
console.log( bookHotel( 'Bloom Hotel', '2026-07-29', '2026-07-30' ) ); // Case 2