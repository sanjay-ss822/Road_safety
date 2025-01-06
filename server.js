const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Array to store reports
let reports = [];

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', (req, res) => {
    console.log('Received a request for the homepage');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for reporting hazards
app.post('/api/report', upload.single('photo'), (req, res) => {
    const { location, description } = req.body;
    const photo = req.file ? req.file.filename : null; // Get the uploaded file's name

    // Store the report in memory
    reports.push({ location, description, photo });
    console.log('Incident reported:', { location, description, photo });
    res.status(201).send('Incident reported successfully');
});

// API endpoint to get all reports
app.get('/api/reports', (req, res) => {
    res.json(reports);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});