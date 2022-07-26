import { io } from 'socket.io-client';
import create from 'zustand';

export const socket = io('ws://localhost:3000', { transports: ['websocket'] });

interface IStore {
    user: string | null;
    messages: Record<string, string[]>;
    users: string[];
    activeUser: string | null;
    setUser: (user: string) => void;
    setActiveUser: (user: string | null) => void;
    addUser: (user: string) => void;
    removeUser: (user: string) => void;
    addMessage: (msg: string, from: string, to: string) => void;
}

export const useStore = create<IStore>((set) => ({
    messages: {},
    users: [],
    user: null,
    activeUser: null,
    setUser: (user) => set({ user }),
    setActiveUser: (user) => set({ activeUser: user }),
    addUser: (user) => set((prev) => ({ users: [...prev.users, user] })),
    removeUser: (user) => set((prev) => ({ users: prev.users.filter((u) => u !== user) })),
    addMessage: (msg, from) =>
        set((prev) => ({
            messages: {
                ...prev.messages,
                [from]: [...(prev.messages[from] || []), msg],
            },
        })),
}));

socket.emit('list-users');

socket.io.on('reconnect_attempt', () => console.log(`Attempting to reconnect ...`));

socket.on('users', (users: string[]) => users.forEach((u) => useStore.getState().addUser(u)));
socket.on('user-added', (user: string) => useStore.getState().addUser(user));
socket.on('user-removed', (user: string) => useStore.getState().removeUser(user));
socket.on('message', ({ from, to, message }: { from: string; to: string; message: string }) =>
    useStore.getState().addMessage(message, from, to)
);

socket.on('message-history', (msg) => console.log(`\n${msg}`));
