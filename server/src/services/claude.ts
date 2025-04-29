import axios from 'axios';
import { FormData } from '../types/formData';
import { Response } from 'express';
import { PROMPT_TEMPLATE } from '../config/promptTemplate';
import { logInfo, logError, logDebug } from '../utils/logger';

// New function to log the full prompt in a structured format
function logFullPrompt(formData: FormData, prompt: string) {
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
  
  logDebug(logEntry, 'full_prompts.log');
  logInfo(`Full prompt logged to full_prompts.log`);
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

    logInfo('Starting Claude API request');

    // Generate the prompt
    const prompt = generatePrompt(formData);
    
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

    logDebug(`Request data: ${JSON.stringify(requestData, null, 2)}`, 'claude_requests.log');
    logInfo(`API Key (first 10 chars): ${process.env.ANTHROPIC_API_KEY.substring(0, 10)}`);

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
          logInfo(`Response status: ${status}`);
          return true; // Don't reject any status codes
        }
      });

      logInfo(`Response headers: ${JSON.stringify(response.headers)}`);

      // If we got an error response, log it completely
      if (response.status !== 200) {
        let errorData = '';
        response.data.on('data', (chunk: Buffer) => {
          errorData += chunk.toString();
        });
        
        response.data.on('end', () => {
          logError(`Complete error response: ${errorData}`);
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
        logDebug(`Received chunk: ${text}`, 'claude_stream.log');

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
              logError(`Parse error: ${parseError}`);
            }
          }
        }
      });

      response.data.on('end', () => {
        logDebug(`Full response: ${fullResponse}`, 'claude_responses.log');
        logInfo('Stream ended normally');
        res.write('data: {"type":"done"}\n\n');
        res.end();
      });

      response.data.on('error', (error: Error) => {
        logError(`Stream error: ${error}`);
        res.write(`data: ${JSON.stringify({ type: 'error', message: `Stream error: ${error.message}` })}\n\n`);
        res.end();
      });

    } catch (requestError) {
      logError(`Request error: ${requestError}`);
      if (axios.isAxiosError(requestError)) {
        logError(`Response data: ${JSON.stringify(requestError.response?.data)}`);
        logError(`Response status: ${requestError.response?.status}`);
        logError(`Response headers: ${JSON.stringify(requestError.response?.headers)}`);
      }
      throw requestError;
    }

  } catch (error: unknown) {
    logError(`Top-level error: ${error}`);
    let errorMsg = '';
    if (error instanceof Error) {
      errorMsg = error.stack || error.message;
    } else {
      errorMsg = String(error);
    }
    logError(errorMsg, 'claude_errors.log');

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
    logInfo('Claude API access verified successfully!');
    return true;
  } catch (error) {
    logError(`Claude API test failed: ${error}`);
    return false;
  }
}; 