const add = ( x, y ) => x + y;
const subtract = ( x, y ) => add( x, -y );

const multiply = ( x, y ) => x * y;

module.exports = function() {
    console.log( 'an function exported from arithmetic module' );
};