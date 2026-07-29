// number, boolean, string
// Wrapper classes - Number, Boolean, String

let quote = "With great power comes great responsibility";

// concatenation, strip (remove spaces at beginning and end), split based on delimiter, substring, replace a substring with another, find if a string contains a substring (including maybe the position where it is found)

quote = quote + '!';
console.log( quote );

// TAKEAWAY: string is immutable -> you CANNOT change the characters in a string in JS
console.log( '------' );
quote = '   ' + quote + '   '; // Add some leading and trailing spaces
console.log( `BEFORE quote = quote.trim(), quote = ${quote}` );

// Internally the string is converted to a wrapper String object, and the method trim() is called.
// quote = new String( quote ).trim();
quote = quote.trim(); // removes leading and trailing spaces, and returns the new string. SO we need to store the result!

console.log( `AFTER trim() quote = quote.trim(), quote = ${quote}` );
console.log( '------' );

console.log( '------' );
const subQuote = quote.substring( 5, 10 );
console.log( `subQuote = ${subQuote}` );
console.log( '------' );

// Write code to replace ALL occurences of substring 'great' with 'greater'
// quote = quote.replace( 'great', 'greater' );
// quote = quote.replaceAll( 'great', 'greater' );
// g -> "global" find
quote = quote.replace(/great/g, "greater");
console.log( 'AFTER quote.replace() = ', quote );

const idxFirstMatch = quote.indexOf( 'power' );
console.log( `first match at position = ${idxFirstMatch}` ); // index 13

const x1 = Number.parseInt( '1.5' );
const x2 = Number.parseFloat( '1.5' );

console.log( x1, x2 );