const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON in request body

// Assignment Route
app.post('/api/assignments', (req, res) => {
    const { title, dueDate } = req.body;

    if (!title || !dueDate) {
        return res.status(400).json({ message: 'Title and due date are required' });
    }

    // TODO: Save to DB or memory
    res.status(201).json({ message: 'Assignment added successfully' });
});

// Default fallback route
app.get('/', (req, res) => {
    res.send('Assignment API running');
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

app.get('/api/user-profile', (req, res) => {
    // Sample user profile data (replace with DB query if needed)
    const userProfile = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+250781234567',
        role: 'User'
    };

    res.json(userProfile);
});
