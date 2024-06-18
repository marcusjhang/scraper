const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// The pool is a cache of connections between the defined db and the server. Basically, allows you to connect your postgres db to the API defined below. 
// You can run queries to the db using the pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'scholarships_db',
    password: 'password', // postgres password (currently the pw for the db is password)
    port: 5432,
});

// Get All Scholarships
app.get('/api/scholarships', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM scholarships');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Search Scholarships
app.get('/api/scholarships/search', async (req, res) => {
    try {
        const { country, field_of_study, degree_level } = req.query;
        let query = 'SELECT * FROM scholarships WHERE 1=1'; // 1=1 allows you to continue adding other requirements below 
        const params = [];

        // sequentially adding to the query (note that sql is 1-indexed, so $1, $2, $3, etc.)
        if (country) {
            params.push(country);
            query += ` AND country = $${params.length}`;
        }

        if (field_of_study) {
            params.push(field_of_study);
            query += ` AND field_of_study = $${params.length}`;
        }

        if (degree_level) {
            params.push(degree_level);
            query += ` AND degree_level = $${params.length}`;
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Scholarship by ID
app.get('/api/scholarships/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM scholarships WHERE scholarship_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('Scholarship not found');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});