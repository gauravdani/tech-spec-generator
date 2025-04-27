import axios from 'axios';
import { FormData } from '../types/formData';

export const generateSpecification = async (formData: FormData): Promise<string> => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    const prompt = generatePrompt(formData);
    
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

    return response.data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid or missing API key. Please check your ANTHROPIC_API_KEY environment variable.');
    }
    throw error;
  }
};

const generatePrompt = (formData: FormData): string => {
  return `As a data engineer, generate a detailed, privacy-compliant event tracking specification document for a ${formData.businessType} business.

Technical Context:
- Platform: ${formData.platformType}
- Device Type: ${formData.deviceType}
- Tracking Tool: ${formData.trackingTool}

For each event, include:
1. Event Name and Description
2. Required and Optional Properties (in a table format)
3. Implementation Example
4. Trigger Conditions
5. Testing Guidelines

Formatting Requirements:
1. Use proper HTML structure with semantic elements
2. Format event property tables with the following columns:
   - Property Name
   - Required/Optional
   - Data Type
   - Description
   - Example Value

3. Format code examples using syntax-highlighted code blocks:
   \`\`\`javascript
   // Code example here
   \`\`\`

4. Use consistent heading levels:
   - H1 for document title
   - H2 for main sections
   - H3 for subsections
   - H4 for event names

5. Ensure proper spacing between sections for readability

Format the output as a well-structured document that can be easily read and copied.`;
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