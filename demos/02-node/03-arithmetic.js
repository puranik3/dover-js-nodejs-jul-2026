console.log( 'executing arithmetic module' );

// add() is "private" to the module
const add = ( x, y ) => x + y;


// default value assigned to module.exports -> {}
// console.log( module.exports );  // {}

// add to the default object
// module.exports.subtract = ( x, y ) => add( x, -y );
// module.exports.multiply = ( x, y ) => x * y;

const subtract = ( x, y ) => add( x, -y );
const multiply = ( x, y ) => x * y;


// module.exports = function() {
//     console.log( 'an function exported from arithmetic module' );
// };

// module.exports = {
//     // subtract: subtract,
//     // multiply: multiply
//     subtract,
//     multiply
// };

/*export default */function introduce() {
    console.log( 'i am arithmetic module' );
}

export {
    introduce as default,
    subtract,
    multiply
}

console.log( 'end of arithmetic module' );