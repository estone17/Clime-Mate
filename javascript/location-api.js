const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the 'location-search' and 'javascript' directories
app.use(express.static(path.join(__dirname, '..', 'location-search')));
app.use(express.static(path.join(__dirname, '..', 'javascript')));

// Route to serve the location.html from the 'location-search' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'location-search', 'location.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
