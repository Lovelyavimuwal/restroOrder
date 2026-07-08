import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-room', (room) => socket.join(room));
    socket.on('new-order', (order) => io.emit('order-update', order));
    socket.on('status-update', (payload) => io.to(payload.room).emit('status-update', payload));
  });

  return io;
};

export const getIO = () => io;
