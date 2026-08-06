import dotenv from 'dotenv';
import indexRouter from './routes/index.route';

dotenv.config(); // this is how we read and load the variables from the .env file

import express from 'express';

const app = express();

// app.use() integrates a middleware with the app
app.use(indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error.message);
        return;
    }

    console.log(`Server running on http://localhost:${PORT}`);
});
