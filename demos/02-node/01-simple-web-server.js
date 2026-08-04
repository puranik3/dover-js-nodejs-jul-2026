// CommonJS module specification
// const http = require('http')
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

server.listen( PORT );

console.log( 'Rest of code continues' );
