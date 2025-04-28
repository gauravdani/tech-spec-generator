import { useState, useCallback } from 'react';
import { SpecFormData } from '../types/formData';

interface StreamState {
  content: string;
  error: string | null;
}

export function useClaudeStream() {
  const [state, setState] = useState<StreamState>({
    content: '',
    error: null
  });

  const startStream = useCallback(async (formData: SpecFormData) => {
    setState({ content: '', error: null });
    
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
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process the buffer for SSE messages
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
            if (data.specification) {
              setState(prev => ({
                ...prev,
                content: data.specification
              }));
            }
          } catch (e) {
            console.error('JSON parse error:', e, 'for line:', jsonStr);
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  }, []);

  return {
    content: state.content,
    error: state.error,
    startStream
  };
} 