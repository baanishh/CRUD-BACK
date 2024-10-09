// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const { createNote, getNotes, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createNote);
router.get('/', protect, getNotes);
// Update a specific note
router.put('/:id', protect, updateNote);

// Delete a specific note
router.delete('/:id', protect, deleteNote);

module.exports = router;
