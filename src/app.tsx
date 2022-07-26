import React, { useState } from 'react';

import { Messages } from './messages';
import { Sidebar } from './sidebar';
import { socket, useStore } from './store';

import './styles.css';

export const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [name, setName] = useState('');

    const setUser = useStore((store) => store.setUser);

    if (!loggedIn) {
        const onClick = () => {
            setLoggedIn(true);
            socket.emit('login', { name });
            setUser(name);
        };

        return (
            <div className="login">
                <label htmlFor="login">Username:</label>
                <input id="login" onChange={(e) => setName(e.target.value)} />
                <button onClick={onClick}>Login</button>
            </div>
        );
    }

    return (
        <div className="app">
            <Sidebar />
            <Messages />
        </div>
    );
};
