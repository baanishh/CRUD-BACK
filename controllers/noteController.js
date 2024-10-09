// controllers/noteController.js
const Note = require('../models/Note');

// Create a new note
exports.createNote = async (req, res) => {
    const { title, content } = req.body;

    try {
        const note = new Note({
            user: req.user.id,
            title,
            content,
        });

        await note.save();

        res.status(201).json({ message: 'Note created', note });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all notes for a user
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ notes });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



// ... existing createNote and getNotes functions

// Update a note
exports.updateNote = async (req, res) => {
    const { id } = req.params; // Note ID from URL
    const { title, content } = req.body;

    try {
        let note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update fields
        note.title = title || note.title;
        note.content = content || note.content;

        await note.save();

        res.status(200).json({ message: 'Note updated', note });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// controllers/noteController.js

// ... existing functions

// Delete a note
exports.deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        console.log('Note ID:', id);
        console.log('Authenticated user:', req.user);

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Use deleteOne instead of remove
        await Note.deleteOne({ _id: id });

        res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
