// CommonJS module specification
// const http = require('http')
// The HTTP server is an "event emitter" (a base class called EventEmitter)
const http = require('node:http');

const server = http.createServer(
    // a function that will be called when an HTTP request comes in
    ( req, res ) => {
        console.log( req.url );

        res.write( 'Hello, world' );
        res.end( 'That is all folks' );
    }
);

const PORT = 3000;

// listen is async and non-blocking
server.listen( PORT ); // this async -> takes some time to start up the server 

server.on(
    'listening',
    () => { // called when the server starts listening successfully
        console.log( 'Check http://localhost:' + PORT );
    }
);

server.on(
    'error',
    ( error ) => { // called when the server could not start
        console.log( error.message );
    }
);

console.log( 'Rest of code continues' );
