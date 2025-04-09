const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Replace these with your actual MySQL credentials
const db = mysql.createConnection({
  host: 'database-1.c41c0cegyp3p.us-east-1.rds.amazonaws.com',
  port: 3306,
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'your_database_name',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL (Amazon RDS)');
});

// ✅ Route: Register Handyman
app.post('/register', (req, res) => {
  const {
    first_name,
    last_name,
    phone,
    profession,
    city,
    email,
    password,
  } = req.body;

  if (!first_name || !last_name || !phone || !profession || !city || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = `
    INSERT INTO handymen (first_name, last_name, phone, profession, city, email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, phone, profession, city, email, password],
    (err, result) => {
      if (err) {
        console.error('❌ Error inserting handyman:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      res.status(201).json({ message: 'Handyman registered successfully', id: result.insertId });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
