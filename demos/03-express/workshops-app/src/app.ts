import dotenv from 'dotenv';
import indexRouter from './routes/index.route';
import workshopsRouter from './routes/workshops.route';

dotenv.config(); // this is how we read and load the variables from the .env file

import express from 'express';

const app = express();

// The order of setup of middleware is VERY IMPORTANT
app.use(express.json());

// app.use() integrates a middleware with the app
app.use(indexRouter);

// This router handles only requests starting with '/workshops'
app.use('/api/workshops', workshopsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error.message);
        return;
    }

    console.log(`Server running on http://localhost:${PORT}`);
});
