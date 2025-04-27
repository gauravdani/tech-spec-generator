import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/auth';

export const setupWebSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const user = await verifyToken(token);
      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.id);

    // Join spec room
    socket.on('join-spec', (specId: string) => {
      socket.join(`spec:${specId}`);
    });

    // Handle real-time updates
    socket.on('update-spec', (data: { specId: string; changes: any }) => {
      socket.to(`spec:${data.specId}`).emit('spec-updated', data.changes);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user.id);
    });
  });

  return io;
}; 