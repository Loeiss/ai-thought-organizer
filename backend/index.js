
const express = require('express');
const app = express();
const port = 3001; // Choose a different port than Next.js default (3000)

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/api/organize-thought', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text content is required.' });
    }

    console.log('Received unstructured text:', text);

    // In a real scenario, this is where we would:
    // 1. Send the text to the AI model for processing/organization.
    // 2. Store the organized thought in a database (e.g., Supabase).
    // For this MVP, we'll just acknowledge receipt.

    res.status(200).json({
        message: 'Text received and will be processed.',
        receivedText: text,
        // In the future, this would include the organized thought.
    });
});

app.listen(port, () => {
    console.log(`Backend API listening at http://localhost:${port}`);
});
