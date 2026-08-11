import dotenv from 'dotenv';
import indexRouter from './routes/index.route';
import workshopsRouter from './routes/workshops.route';

import './data/init';

dotenv.config(); // this is how we read and load the variables from the .env file

import express from 'express';

import { errorHandler, resourceNotFoundHandler } from './middleware/errors';

const app = express();

// 1. Middleware are functions
// 2. They are called every time a request is received
// 3. They are executed in the order they are passed to app.use()
// 4. Middleware are used for handling "cross-cutting concerns" (what you want to do on every request)
app.use((req, res, next) => {
    console.log('middleware 1 called');
    const requestDate = new Date();

    next(); // now Express knows we are done processing the request

    console.log('middleware 1 after call to next');
    const responseDate = new Date();

    console.log('Time for processing (in ms) = ', responseDate.getTime() - requestDate.getTime());
});

// The order of setup of middleware is VERY IMPORTANT
app.use(express.json());

// app.use() integrates a middleware with the app
app.use(indexRouter);

app.use((req, res, next) => {
    console.log('middleware after indeRouter');
    next(); // VERY IMPORTANT -> Otherwise request will be stuck on this line
    console.log('Response is going out from middleware after indexRouter');
});

// This router handles only requests starting with '/workshops'
app.use('/api/workshops', workshopsRouter);

// 404 middleware - ADD IT AS THE LAST MIDDLEWARE
app.use(resourceNotFoundHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error.message);
        return;
    }

    console.log(`Server running on http://localhost:${PORT}`);
});
