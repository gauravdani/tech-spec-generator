import axios from 'axios';
import { FormData } from '../types/formData';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PROMPT_TEMPLATE } from '../config/promptTemplate';

const LOG_DIR = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  console.log(`🟢 Server: Created logs directory at ${LOG_DIR}`);
} else {
  console.log(`🟢 Server: Logs directory already exists at ${LOG_DIR}`);
}

function logToFile(filename: string, data: string) {
  try {
    const filePath = path.join(LOG_DIR, filename);
    fs.appendFileSync(filePath, data + '\n', 'utf8');
    console.log(`🟢 Server: Successfully logged to ${filename} at ${filePath}`);
  } catch (error) {
    console.error(`🔴 Server: Error logging to ${filename}:`, error);
  }
}

// New function to log the full prompt in a structured format
function logFullPrompt(formData: FormData, prompt: string) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `
=== FULL PROMPT LOG - ${timestamp} ===
Business Type: ${formData.businessType}
Platform Types: ${formData.platformTypes.join(', ')}
Device Types: ${formData.deviceTypes.join(', ')}
Tracking Tool: ${formData.trackingTool}
Selected Events: ${formData.selectedEvents.join(', ')}

PROMPT:
${prompt}
=== END PROMPT ===
`;
    
    logToFile('full_prompts.log', logEntry);
    console.log(`🟢 Server: Full prompt logged to full_prompts.log`);
  } catch (error) {
    console.error(`🔴 Server: Error in logFullPrompt:`, error);
  }
}

export const generateSpecification = async (formData: FormData, res: Response): Promise<void> => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log('🟢 Server: Starting Claude API request');

    // Generate the prompt
    const prompt = generatePrompt(formData);
    
    // Direct console log of the prompt for debugging
    console.log('🟢 Server: Generated prompt:');
    console.log('----------------------------------------');
    console.log(prompt);
    console.log('----------------------------------------');
    
    // Log the full prompt in a structured format
    logFullPrompt(formData, prompt);
    
    // First, let's log the exact request we're about to make
    const requestData = {
      model: "claude-3-opus-20240229",
      messages: [{
        role: "user",
        content: prompt
      }],
      max_tokens: 4000,
      stream: true
    };

    console.log('🟢 Server: Request data:', JSON.stringify(requestData, null, 2));
    console.log('🟢 Server: API Key (first 10 chars):', process.env.ANTHROPIC_API_KEY.substring(0, 10));

    // Also log to the existing log file for backward compatibility
    logToFile('claude_requests.log', `[${new Date().toISOString()}] REQUEST:\n${prompt}\n`);

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.anthropic.com/v1/messages',
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        responseType: 'stream',
        validateStatus: (status) => {
          console.log('🟢 Server: Response status:', status);
          return true; // Don't reject any status codes
        }
      });

      console.log('🟢 Server: Response headers:', response.headers);

      // If we got an error response, log it completely
      if (response.status !== 200) {
        let errorData = '';
        response.data.on('data', (chunk: Buffer) => {
          errorData += chunk.toString();
        });
        
        response.data.on('end', () => {
          console.error('🔴 Server: Complete error response:', errorData);
          res.write(`data: ${JSON.stringify({ type: 'error', message: `API Error: ${response.status} - ${errorData}` })}\n\n`);
          res.end();
        });
        
        return;
      }

      // Send initial message
      res.write('data: {"type":"start"}\n\n');

      let fullResponse = '';
      response.data.on('data', (chunk: Buffer) => {
        const text = chunk.toString();
        fullResponse += text;
        console.log('🟢 Server: Received chunk:', text);

        const lines = text.split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5));
              if (data.type === 'content_block_delta' && data.delta?.text) {
                res.write(`data: ${JSON.stringify({ type: 'content', text: data.delta.text })}\n\n`);
              }
            } catch (parseError) {
              console.error('🔴 Server: Parse error:', {
                error: parseError,
                line: line,
                lineLength: line.length
              });
            }
          }
        }
      });

      response.data.on('end', () => {
        logToFile('claude_responses.log', `[${new Date().toISOString()}] RESPONSE:\n${fullResponse}\n`);
        console.log('🟢 Server: Stream ended normally');
        res.write('data: {"type":"done"}\n\n');
        res.end();
      });

      response.data.on('error', (error: Error) => {
        console.error('🔴 Server: Stream error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', message: `Stream error: ${error.message}` })}\n\n`);
        res.end();
      });

    } catch (requestError) {
      console.error('🔴 Server: Request error:', requestError);
      if (axios.isAxiosError(requestError)) {
        console.error('🔴 Server: Response data:', requestError.response?.data);
        console.error('🔴 Server: Response status:', requestError.response?.status);
        console.error('🔴 Server: Response headers:', requestError.response?.headers);
      }
      throw requestError;
    }

  } catch (error: unknown) {
    console.error('🔴 Server: Top-level error:', error);
    let errorMsg = '';
    if (error instanceof Error) {
      errorMsg = error.stack || error.message;
    } else {
      errorMsg = String(error);
    }
    logToFile('claude_errors.log', `[${new Date().toISOString()}] ERROR:\n${errorMsg}\n`);

    res.write(`data: ${JSON.stringify({ type: 'error', message: errorMsg })}\n\n`);
    res.end();
  }
};

const generatePrompt = (formData: FormData): string => {
  return PROMPT_TEMPLATE(formData);
};

export const testClaudeAPI = async () => {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-opus-20240229",
        max_tokens: 100,
        messages: [{
          role: "user",
          content: "Hello, this is a test message."
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
    return true;
  } catch (error) {
    console.error('❌ Claude API test failed:', error);
    return false;
  }
}; 