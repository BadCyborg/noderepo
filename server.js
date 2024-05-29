const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

// Define the port to run the server on
const PORT = 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'phpuser', // Replace with your MySQL user
    password: 'password', // Replace with your MySQL password
    database: 'testdb', // Replace with your MySQL database
    port: 2207 // Replace with your MySQL port (2207 as per your configuration)
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id', connection.threadId);
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Execute a query to fetch data from the database
        connection.query('SELECT * FROM users', (err, results, fields) => { 
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database query error');
                return;
            }
            
            // Read the HTML file
            fs.readFile(path.join(__dirname, '/public/index.html'), (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                
                // Convert results to a string and include in the HTML
                const resultString = JSON.stringify(results);
                const htmlContent = data.toString().replace('{{data}}', resultString);

                // Send the HTML file content
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(htmlContent);
            });
        });
    } else {
        // Handle 404 - Not Found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

