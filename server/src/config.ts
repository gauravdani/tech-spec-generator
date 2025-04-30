import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  maxTokens: parseInt(process.env.MAX_TOKENS || '4096', 10),
  environment: process.env.NODE_ENV || 'development',
  
  // Claude API settings
  defaultModel: 'claude-3-sonnet-20240229',
  defaultTemperature: 0.7,
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

export default config; 