import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGlobalState } from './useGlobalState';
import { authService } from '../services/auth';

export const useRealtimeSpec = (specId: string) => {
  const socket = useCallback(() => {
    return io(process.env.REACT_APP_WS_URL!, {
      auth: {
        token: authService.getToken(),
      },
    });
  }, []);

  useEffect(() => {
    const ws = socket();

    ws.emit('join-spec', specId);

    ws.on('spec-updated', (changes) => {
      // Handle real-time updates
    });

    return () => {
      ws.disconnect();
    };
  }, [specId, socket]);

  const updateSpec = useCallback((changes: any) => {
    const ws = socket();
    ws.emit('update-spec', { specId, changes });
  }, [specId, socket]);

  return { updateSpec };
}; 