import dotenv from 'dotenv';

dotenv.config(); // this is how we read and load the variables from the .env file

import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.write('This is the workshops app. It serves details of workshops happening nearby!!!!');
    res.end();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error.message);
        return;
    }

    console.log(`Server running on http://localhost:${PORT}`);
});
