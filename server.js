const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test Claude API access on server start
async function testClaudeAPI() {
    try {
        console.log('Testing Claude API access...');
        console.log('API Key present:', process.env.ANTHROPIC_API_KEY ? '✓' : '✗');
        
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: "claude-3-opus-20240229",
                max_tokens: 100,
                messages: [{
                    role: "user",
                    content: "Hi Claude, this is a test message to verify API access."
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        );
        console.log('✅ Claude API access verified successfully!');
    } catch (error) {
        console.error('\n❌ Claude API test failed:');
        console.error('Status:', error.response?.status);
        console.error('Error:', error.response?.data || error.message);
        console.error('\nTroubleshooting tips:');
        console.error('1. Check if ANTHROPIC_API_KEY is set in your .env file');
        console.error('2. Verify your API key is valid');
        console.error('3. Check your network connection\n');
    }
}

// Main endpoint for generating specifications
app.post('/api/generate-spec', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        
        // Get prompt either directly or generate it from form data
        let prompt;
        if (req.body.prompt) {
            prompt = req.body.prompt;
        } else if (req.body.businessType) {
            // Generate prompt from form data
            const { businessType, platformType, deviceType, trackingTool, selectedEvents } = req.body;
            
            prompt = `As a data engineer, generate a detailed, privacy-compliant event tracking specification document to be used by frontend/mobile engineers and product managers. The tracking is to be implemented using ${trackingTool}.

The specification should be customized for a ${businessType} business running on ${platformType} for ${deviceType}.

🧩 For each of the following events, create a full section in the document. Do not skip or summarize any event. Every event in this list must have its own section in the output, even if the event seems similar to others:

${selectedEvents.join(', ')}

For each event, include the following:

📌 Event Name

📝 Clear description of what it captures

📊 Event properties — required and optional (with example values)

💻 Frontend implementation snippet — in JavaScript (for web) or relevant SDK for other platforms

⚙️ Trigger instruction — when, where, and under what conditions the event should be triggered

Organize the document so that each event and its code snippet appear together (side by side or one after the other).

FORMATTING REQUIREMENTS:
- Create properly formatted tables for event properties with clear columns for Property, Required/Optional, Type, Description, and Example Value
- Format all code snippets using proper code blocks to ensure syntax highlighting and clear distinction from regular text
- Ensure all code snippets can be easily copied without formatting issues
- Use consistent heading levels throughout the document for clear hierarchy
- Use proper spacing between sections for readability

Additional specifications:

🧑‍💻 User identity: Clarify how to handle anonymous, guest, and registered users

🔐 Consent & privacy: Events should only fire if the user has opted-in per GDPR/CCPA; include conditional tracking logic

🧪 Testing guide: Describe how to test and validate event capture using tools like Segment Debugger, browser console, or SDK logs

📈 PM usage section: Describe how product managers can analyze this data for funnels, user segmentation, or conversion

📚 Provide references: Link to SDK documentation, JS libraries, CDN links, and other relevant technical sources

Write the document in a clear, professional tone — understandable by engineers and product managers alike. Prioritize clarity, structure, and practical implementation.`;
        }

        if (!prompt) {
            return res.status(400).json({ error: 'Invalid request format' });
        }

        console.log('Generated/Received prompt:', prompt.substring(0, 100) + '...');

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: "claude-3-opus-20240229",
                max_tokens: 4000,
                messages: [{
                    role: "user",
                    content: prompt
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        );

        console.log('Claude API call successful');
        
        // Add CSS to style the response
        const cssStyles = `
        <style>
        .spec-document {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .event-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 6px;
            overflow: hidden;
        }

        .event-table th {
            background: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
        }

        .event-table td {
            padding: 12px;
            border-top: 1px solid #e5e7eb;
        }

        .event-table tr:nth-child(even) {
            background: #f8fafc;
        }

        pre code {
            background: #1e293b;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 6px;
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            display: block;
            margin: 1rem 0;
            position: relative;
            white-space: pre-wrap;
        }

        h1, h2, h3, h4, h5, h6 {
            color: #2563eb;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }

        h1 { font-size: 2.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.5rem; }

        p { margin: 1rem 0; }

        ul, ol {
            padding-left: 1.5rem;
            margin: 1rem 0;
        }

        li { margin: 0.5rem 0; }
        </style>`;

        // Wrap the response in a div and add CSS
        const formattedResponse = `
            ${cssStyles}
            <div class="spec-document">
                ${response.data.content[0].text}
            </div>`;
        
        res.json({ specification: formattedResponse });
    } catch (error) {
        console.error('Error in /api/generate-spec:', error);
        console.error('API Key present:', !!process.env.ANTHROPIC_API_KEY);
        res.status(500).json({ error: error.message });
    }
});

// Start the server and test Claude API
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await testClaudeAPI();
}); 