const now = new Date();
console.log( now );

const independenceDay = new Date( '2026-08-15' );
console.log( independenceDay );

console.log( independenceDay.getFullYear() );
console.log( 'this year indep day = ', independenceDay.getDay() );

// set to independence day for next year
independenceDay.setFullYear( 2027 );

console.log( independenceDay );
console.log( 'next year indep day = ', independenceDay.getDay() ); // 0 -> Sun, 1 -> Mon, ..., 6 -> Sat

// Explore: Libraries
// moment -> not used anymore
// date_fns