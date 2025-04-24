const express = require('express');
const path = require('path');
const axios = require('axios');
const { generatePrompt } = require('./prompt-template');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Claude API endpoint
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// API route to generate specification
app.post('/api/generate-spec', async (req, res) => {
    try {
        const { businessType, platformType, deviceType, trackingTool, selectedEvents } = req.body;

        if (!businessType || !platformType || !deviceType || !trackingTool || !selectedEvents || !selectedEvents.length) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Generate prompt using the template
        const prompt = generatePrompt(businessType, platformType, deviceType, trackingTool, selectedEvents);

        // Call Claude API
        const response = await axios.post(CLAUDE_API_URL, {
            model: 'claude-3-opus-20240229',
            max_tokens: 4000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });

        // Extract the specification from Claude's response
        const specification = response.data.content[0].text;

        res.json({ specification });
    } catch (error) {
        console.error('Error calling Claude API:', error);
        res.status(500).json({ 
            error: 'Failed to generate specification',
            details: error.message 
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 