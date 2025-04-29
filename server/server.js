const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const config = require('./config');
const dotenv = require('dotenv');
const { PROMPT_TEMPLATE } = require('./src/config/promptTemplate.js');

// Ensure logs directory exists
const LOG_DIR = path.join(__dirname, config.logDir);
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Logging utility
function logToFile(filename, data) {
  const filePath = path.join(LOG_DIR, filename);
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${data}\n`;
  
  fs.appendFileSync(filePath, logEntry, 'utf8');
  console.log(`Logged to ${filename}: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
}

const app = express();

// Middleware setup
app.use(cors({
  origin: config.clientUrl,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request
  logToFile('requests.log', `REQUEST: ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    logToFile('requests.log', `REQUEST BODY: ${JSON.stringify(req.body)}`);
  }
  
  // Capture response
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - start;
    logToFile('responses.log', `RESPONSE: ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    return originalSend.call(this, body);
  };
  
  next();
});

// Test Claude API access on server start
async function testClaudeAPI() {
    try {
        console.log('Testing Claude API access...');
        logToFile('server.log', 'Testing Claude API access...');
        console.log('API Key present:', config.anthropicApiKey ? '✓' : '✗');
        logToFile('server.log', `API Key present: ${config.anthropicApiKey ? '✓' : '✗'}`);
        
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
                    'x-api-key': config.anthropicApiKey,
                    'anthropic-version': '2023-06-01'
                }
            }
        );
        console.log('✅ Claude API access verified successfully!');
        logToFile('server.log', '✅ Claude API access verified successfully!');
    } catch (error) {
        console.error('\n❌ Claude API test failed:');
        console.error('Status:', error.response?.status);
        console.error('Error:', error.response?.data || error.message);
        console.error('\nTroubleshooting tips:');
        console.error('1. Check if ANTHROPIC_API_KEY is set in your .env file');
        console.error('2. Verify your API key is valid');
        console.error('3. Check your network connection\n');
        
        logToFile('errors.log', `❌ Claude API test failed: Status: ${error.response?.status}, Error: ${JSON.stringify(error.response?.data || error.message)}`);
    }
}

// Main endpoint for generating specifications
app.post('/api/generate-spec', async (req, res) => {
    try {
        console.log('🟡 SERVER: Starting /api/generate-spec endpoint');
        
        // Get prompt either directly or generate it from form data
        let prompt;
        if (req.body.prompt) {
            prompt = req.body.prompt;
            console.log('🟡 SERVER: Using provided prompt');
        } else if (req.body.businessType) {
            // Generate prompt from form data
            const { businessType, platformTypes, deviceTypes, trackingTool, selectedEvents } = req.body;
            console.log('🟡 SERVER: Generating prompt from form data');
            
            // Use the global prompt template
            prompt = PROMPT_TEMPLATE({
                businessType,
                platformTypes,
                deviceTypes,
                trackingTool,
                selectedEvents
            });
        }

        if (!prompt) {
            console.log('🔴 SERVER: Invalid request format - No prompt or business type provided');
            return res.status(400).json({ error: 'Invalid request format' });
        }

        console.log('🟡 SERVER: Generated/Received prompt:', prompt.substring(0, 100) + '...');

        // Set headers for streaming
        console.log('🟡 SERVER: Setting up SSE headers');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        console.log('🟡 SERVER: Making request to Claude API');
        try {
            const response = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: "claude-3-opus-20240229",
                    max_tokens: 4000,
                    stream: true,
                    messages: [{
                        role: "user",
                        content: prompt
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': config.anthropicApiKey,
                        'anthropic-version': '2023-06-01'
                    },
                    responseType: 'stream'
                }
            );

            console.log('🟢 SERVER: Claude API request successful, setting up stream handlers');

            // Handle the streaming response
            response.data.on('data', chunk => {
                const chunkStr = chunk.toString();
                console.log('🟡 SERVER: Raw chunk received:', chunkStr);
                
                try {
                    // Parse SSE format
                    const lines = chunkStr.split('\n');
                    let eventType = '';
                    let data = null;
                    
                    for (const line of lines) {
                        if (line.startsWith('event: ')) {
                            eventType = line.slice(7);
                        } else if (line.startsWith('data: ')) {
                            try {
                                data = JSON.parse(line.slice(6));
                            } catch (e) {
                                console.log('🟡 SERVER: Skipping non-JSON data line');
                                continue;
                            }
                        }
                    }

                    // Process the parsed data
                    if (data && data.type === 'content_block_delta' && data.delta && data.delta.text) {
                        console.log('🟢 SERVER: Found text content, length:', data.delta.text.length);
                        
                        // Stream the HTML content directly to the client
                        const sseData = `data: ${JSON.stringify({ html: data.delta.text })}\n\n`;
                        res.write(sseData);
                    }
                } catch (error) {
                    console.error('🔴 SERVER: Error processing chunk:', error);
                    console.error('🔴 SERVER: Problematic chunk:', chunkStr);
                }
            });

            response.data.on('end', () => {
                console.log('🟢 SERVER: Stream ended');
                res.end();
            });

            response.data.on('error', (error) => {
                console.error('🔴 SERVER: Stream error:', error);
                res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
                res.end();
            });
        } catch (error) {
            console.error('🔴 SERVER: Error making Claude API request:', error);
            if (error.response) {
                console.error('🔴 SERVER: Claude API error response:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            res.status(500).json({ error: 'Failed to connect to Claude API' });
        }

    } catch (error) {
        console.error('🔴 SERVER: Error in /api/generate-spec:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(config.port, async () => {
    console.log(`Server is running on port ${config.port}`);
    logToFile('server.log', `Server is running on port ${config.port}`);
    await testClaudeAPI();
}); 