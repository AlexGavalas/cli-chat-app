import React, { useState } from 'react';
import { socket, useStore } from './store';

export const Messages = () => {
    const [msg, setMsg] = useState('');

    const activeUser = useStore((store) => store.activeUser || '');

    const messages = useStore((store) =>
        store.activeUser ? store.messages[store.activeUser] || [] : []
    );

    const addMessage = useStore((store) => store.addMessage);

    const onClick = () => {
        setMsg('');
        socket.emit('message', { to: activeUser, message: msg });
        addMessage(msg, activeUser);
    };

    if (!activeUser) return <div>Messages</div>;

    return (
        <div>
            Messages with {activeUser}
            <div className="messages">
                <ul>
                    {messages.map((msg) => (
                        <li key={msg}>{msg}</li>
                    ))}
                </ul>
                <div className="send-wrapper">
                    <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
                    <button onClick={onClick}>Send</button>
                </div>
            </div>
        </div>
    );
};
