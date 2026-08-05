import os from 'node:os';

console.log( os.cpus() );
console.log( os.freemem() );

console.log( process ); // an object available across all modules

// some uses of process object
// 1. to get environment variables
console.log( process.env ); // an object with the environment variables
console.log( process.env.SHELL ); // a particular variable

// 2. read command-line arguments
console.log( process.argv );

let [ , , operation, first, second ] = process.argv;
first = Number.parseFloat( first );
second = Number.parseFloat( second );

let result;

switch( operation ) {
    case 'add':
        result = first + second;
        break;
    case 'sub':
        result = first - second;
        break;
    case 'mul':
        result = first * second;
        break;
    case 'div':
        result = first / second;
        break;
    default:
        result = 'Not defined';
}

console.log( result );

// 3. stop execution of a program;
process.exit( 1 );

console.log( 'last line' );