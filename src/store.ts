import { io } from 'socket.io-client';
import create from 'zustand';

export const socket = io('ws://localhost:3000', { transports: ['websocket'] });

interface IStore {
    user: string | null;
    messages: Record<string, { msg: string; from: string }[]>;
    users: string[];
    activeUser: string | null;
    setUser: (user: string) => void;
    setActiveUser: (user: string | null) => void;
    addUser: (user: string) => void;
    removeUser: (user: string) => void;
    addMessage: (msg: string, from: string, to: string) => void;
    messagesKey: string;
}

export const getKey = (user1: string, user2: string) => {
    return (user1 + user2).split('').sort().join('');
};

export const useStore = create<IStore>((set) => ({
    messages: {},
    users: [],
    user: null,
    activeUser: null,
    messagesKey: '',
    setUser: (user) => set({ user }),
    setActiveUser: (user) => {
        const activeUser = user || '';

        set(({ user: loggedInUser }) => ({
            activeUser,
            messagesKey: getKey(activeUser, loggedInUser || ''),
        }));
    },
    addUser: (user) => {
        set((prev) => ({ users: [...prev.users, user] }));
    },
    removeUser: (user) => {
        set((prev) => ({ users: prev.users.filter((u) => u !== user) }));
    },
    addMessage: (msg, from, to) => {
        const key = getKey(from, to);

        set((prev) => ({
            messages: {
                ...prev.messages,
                [key]: [...(prev.messages[key] || []), { msg, from }],
            },
        }));
    },
}));

socket.emit('list-users');

socket.io.on('reconnect_attempt', () => {
    console.log(`Attempting to reconnect ...`);
});

socket.on('users', (users: string[]) => {
    users.forEach((u) => useStore.getState().addUser(u));
});

socket.on('user-added', (user: string) => {
    useStore.getState().addUser(user);
});

socket.on('user-removed', (user: string) => {
    const { removeUser, setActiveUser, activeUser } = useStore.getState();

    removeUser(user);

    if (activeUser === user) {
        setActiveUser(null);
    }
});

socket.on('message', ({ from, message }: { from: string; message: string }) => {
    const to = useStore.getState().user || '';
    useStore.getState().addMessage(message, from, to);
});

socket.on('message-history', (msg) => console.log(`\n${msg}`));
