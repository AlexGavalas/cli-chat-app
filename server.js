import { Server } from 'socket.io';

const io = new Server(3000);

const messageHistory = [];

const userSockets = new Map();
const sockets = new Map();

io.on('connection', (socket) => {
    socket.on('login', ({ name }) => {
        userSockets.set(name, socket);
        sockets.set(socket.id, name);

        socket.broadcast.emit('user-added', name);
    });

    socket.on('list-users', () => {
        socket.emit('users', [...userSockets.keys()].join(', '));
    });

    socket.on('message', ({ from, to, message }) => {
        const destSocket = userSockets.get(to);

        if (destSocket) {
            destSocket.send({ from, message });

            messageHistory.push({ from, message });
        }
    });

    socket.on('history', ({ limit }) => {
        const requestedMessages = messageHistory
            .slice(-limit)
            .map(({ message, from }) => `[${from}]: ${message}`)
            .join('\n');

        socket.emit('message-history', requestedMessages);
    });

    socket.on('disconnect', () => {
        const name = sockets.get(socket.id);

        sockets.delete(socket.id);
        userSockets.delete(name);

        socket.broadcast.emit('user-removed', name);
    });
});

console.log('Server listening');
