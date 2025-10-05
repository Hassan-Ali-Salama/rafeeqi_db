require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const allRoutes = require('./routes/index');



app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Rafeeqi Backend is OPERATIONAL (Initial Phase)',
        status: 'Running'
    });
});

app.use('/api/v1', allRoutes);

app.listen(PORT, () => {
 console.log(`
        ========================================
        | Server is listening on port ${PORT}      |
        | Access URL: http://localhost:${PORT}     |
        ========================================
    `);
});