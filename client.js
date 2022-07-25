import { io } from 'socket.io-client';
import prompts from 'prompts';

const name = process.argv[2];

console.log(`Welcome ${name}`);

const socket = io('ws://localhost:3000');

let isConnected = false;

socket.io.on('reconnect_attempt', () => {
    console.log(`Attempting to reconnect ...`);
});

socket.on('connect', () => {
    console.log(`Connected to server`);
    isConnected = true;
    socket.emit('login', { name });
});

socket.on('users', (users) => console.log(`\nOnline users are: ${users}\n`));
socket.on('user-added', (user) => console.log(`\nUser ${user} joined the chat`));
socket.on('user-removed', (user) => console.log(`\nUser ${user} left the chat`));
socket.on('message', ({ from, message }) => console.log(`[${from}]: ${message}`));
socket.on('message-history', (msg) => console.log(`\n${msg}`));

while (true) {
    if (!isConnected) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        continue;
    }

    const { message } = await prompts([
        {
            type: 'text',
            name: 'message',
            message: 'Please enter a message (Press exit to quit)?',
        },
    ]);

    if (message === 'list-users') {
        socket.emit('list-users');
    } else if (/^history\s+\d+$/.test(message)) {
        const [, limit] = message.split(/\s/).filter(Boolean);
        socket.emit('history', { limit });
    } else if (message === 'exit') {
        process.exit(0);
    } else {
        const [to, msg] = message.split(':').filter(Boolean);

        socket.emit('message', { from: name, to, message: msg });
    }
}
