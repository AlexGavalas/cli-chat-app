import React from 'react';

import { useStore } from './store';

export const Sidebar = () => {
    const users = useStore((store) => store.users);
    const loggedInUser = useStore((store) => store.user);
    const setActiveUser = useStore((store) => store.setActiveUser);

    return (
        <div>
            <p>Welcome {loggedInUser}</p>
            Online users
            <ul className="users-list">
                {users
                    .filter((user) => user !== loggedInUser)
                    .map((user) => (
                        <li key={user}>
                            <button onClick={() => setActiveUser(user)}>{user}</button>
                        </li>
                    ))}
            </ul>
        </div>
    );
};
