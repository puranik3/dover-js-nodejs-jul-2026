// arithmetic operators
// / -> floating-point division
console.log( "1 / 2 = ", ( 1 / 2 ) ); // 0.5 (floating-point division)
console.log( "Number.parseInt( 1 / 2 ) = ", Number.parseInt( 1 / 2 ) );

console.log( "7 % 4 = ", ( 7 % 4 ) );

console.log( "3.5 ** 4.5 = ", ( 3.5 ** 4.5 ) );

// relational operators
console.log( 1 < 2 ); // similarly >, <=, >=

console.log( '1 == 2', 1 == 2 ); // false
console.log( '1 === 2', 1 === 2 ); // false

console.log( '1 == 1', 1 == 1 ); // true
console.log( '1 === 1', 1 === 1 ); // true

// == checks ONLY value (NOT data type)
// === checks the data type AND value
console.log( 1 == '1' ); // NEVER use this
console.log( 1 === '1' ); // prefer this

const num = parseFloat( '1.5' );
console.log( 'num =', num );

// logical operators
// !, &&, ||
console.log( true && true );
console.log( 1 < 2 && 100 );
console.log( 0 || 100 );
console.log( 1 || 100 );
console.log( [ 1, 2, 3 ] || 100 );
console.log( [ 1, 2, 3 ] && 100 );
console.log( '' && 100 );

// IN JS these values are falsy (equivalent of false in conditionals)
// false, 0, null, undefined, NaN, '' (empty string)

// conditional (ternary)
let isRaining = true
const needUmbrella = isRaining ? "Need umbrella" : "No need";
console.log( 'needUmbrella =', needUmbrella );

// typeof, instanceof (remember Array check - check if objects is an instance of some base class)

console.log( 1 + 2 * 3 ); // 7

console.log( 1 < 2 && 2 < 3 ); // true

