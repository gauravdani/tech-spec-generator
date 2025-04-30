require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    clientUrl: process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' 
        ? 'https://iridescent-kitsune-bb54c5.netlify.app'
        : 'http://localhost:5173'),
    logDir: 'logs',
    maxTokens: parseInt(process.env.MAX_TOKENS) || 1000 // Get from env or default to 1000
};

// Validate required environment variables
if (!config.anthropicApiKey) {
    console.error('❌ ANTHROPIC_API_KEY is required in .env file');
    process.exit(1);
}

// Validate maxTokens is a positive number
if (isNaN(config.maxTokens) || config.maxTokens <= 0) {
    console.error('❌ MAX_TOKENS must be a positive number');
    process.exit(1);
}

module.exports = config; 