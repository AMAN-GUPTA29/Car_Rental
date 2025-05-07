export default function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join_room', (userId) => {
            socket.join(userId);
            console.log(`Socket ${socket.id} joined room ${userId}`);
            socket.emit('room_joined', { userId, socketId: socket.id });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}
