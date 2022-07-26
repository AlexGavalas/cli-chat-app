import React from 'react';

import { useStore } from './store';

export const Sidebar = () => {
    const users = useStore((store) => store.users);
    const setActiveUser = useStore((store) => store.setActiveUser);

    return (
        <div>
            Online users
            <ul className="users-list">
                {users.map((user) => (
                    <li key={user}>
                        <button onClick={() => setActiveUser(user)}>{user}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
