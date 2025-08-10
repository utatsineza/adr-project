const express = require('express');
const router = express.Router();

// POST /api/assignments/
router.post('/', (req, res) => {
    const { title, dueDate } = req.body;
    // TODO: Save to database here.
    res.status(201).json({ message: 'Assignment created', data: { title, dueDate } });
});

module.exports = router;
