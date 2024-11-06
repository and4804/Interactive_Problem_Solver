require('dotenv').config();
const { OpenAI } = require('openai'); // Adjusted import to match current version
const express = require('express');
// Removed body-parser, as it's now part of express
const app = express();
const PORT = 3000;

// Set up middleware to parse JSON request bodies
app.use(express.json());

// Define a route for the root path
app.get('/', (req, res) => {
    res.send('Hello, World! The server is running.');
});

// Initialize OpenAI API with your OpenAI key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Define the API endpoint to solve the problem
app.post('/solve-problem', async (req, res) => {
    const { problem } = req.body;

    // Check if problem is provided in the request body
    if (!problem) {
        return res.status(400).json({ error: 'Problem is required.' });
    }

    try {
        // Send the problem to OpenAI's chat model for step-by-step response
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: problem }],
            temperature: 0.5,
            max_tokens: 100,
        });
    
        // Parse and send the response back
        const solution = response.choices[0].message.content;
        const steps = solution.split("\n"); // Split into steps if necessary
        res.json({ steps });
    } catch (error) {
        console.error('Error:', error); // Log the error
        res.status(500).send({ error: 'Error solving the problem', details: error.message });
    }
    
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
