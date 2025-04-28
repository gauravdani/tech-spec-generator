import { SpecFormData } from '../types/formData';
import logger from '../utils/logger';

interface StreamMessage {
  content?: string;
  error?: string;
  status?: 'started' | 'complete';
}

export const generateSpecification = async (
  formData: SpecFormData, 
  onContent: (content: string) => void,
  onError: (error: string) => void,
  onDone: () => void
) => {
  logger.info('API', 'Starting API call');

  try {
    const response = await fetch('/api/generate-spec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        logger.info('API', 'Stream complete');
        onDone();
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      // Split on double newlines (SSE message boundary)
      const messages = buffer.split('\n\n');
      buffer = messages.pop() || ''; // Save incomplete message for next chunk

      for (const message of messages) {
        // Only process lines that start with "data: "
        const dataLine = message.split('\n').find(line => line.startsWith('data: '));
        if (!dataLine) continue;
        const jsonStr = dataLine.replace(/^data: /, '').trim();
        if (!jsonStr) continue;
        try {
          const data = JSON.parse(jsonStr);
          if (data.type === 'content' && data.text) {
            logger.debug('API', 'Content received', { text: data.text.substring(0, 100) + '...' });
            onContent(data.text);
          } else if (data.type === 'error') {
            logger.error('API', 'Error received', { message: data.message });
            onError(data.message);
          } else if (data.type === 'done') {
            logger.info('API', 'Stream complete');
            onDone();
          }
        } catch (e) {
          // Log and skip, but do not throw
          logger.error('API', 'JSON parse error', { error: e, jsonStr });
        }
      }
    }
  } catch (error) {
    logger.error('API', 'Error', error);
    onError(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const generatePrompt = (formData: SpecFormData): string => {
  const eventsList = formData.selectedEvents
    .map(event => `- ${event}`)
    .join('\n');

  return `Generate a detailed, privacy-compliant event tracking specification document for a ${formData.businessType} business.

Technical Context:
- Platforms: ${formData.platformTypes.join(', ')}
- Device Types: ${formData.deviceTypes.join(', ')}
- Tracking Tool: ${formData.trackingTool}

Selected Events to Document:
${eventsList}

For each selected event above, include:
1. Event Name and Description
2. Required and Optional Properties (in a table format)
3. Implementation Example
4. Trigger Conditions
5. Testing Guidelines

Please format the output as a well-structured HTML document with:
- Semantic HTML elements
- Tables for event properties
- Code blocks for examples
- Proper heading hierarchy (h1, h2, h3, h4)
- Clear spacing between sections`;
}; 