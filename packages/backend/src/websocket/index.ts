import { Server } from 'socket.io';
import type { ClientEvents, ServerEvents } from '@smartcart/shared';

export function setupSocketIO(io: Server<ClientEvents, ServerEvents>) {
  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    // Handle household room joining
    socket.on('join-household', (householdId: string) => {
      socket.join(`household:${householdId}`);
      console.log(`Socket ${socket.id} joined household:${householdId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
}
