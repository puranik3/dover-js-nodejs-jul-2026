// relative paths for modules we create / absolute path for built-in and third-party modules
// const arithmetic = require( './03-arithmetic' );
// const arithmetic2 = require( './03-arithmetic' );

import introduce, { subtract, multiply } from './03-arithmetic.js';
import introduce2, { subtract as subtract2 } from './03-arithmetic.js';

// console.log( arithmetic );

// console.log( arithmetic.subtract( 2, 3 ) );

console.log( subtract( 2, 3 ) );