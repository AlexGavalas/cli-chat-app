# CLI Chat app

This is a client/server CLI chat application.

The server uses socket.io to start a websocket server, and each client connects to it.

The client starts using the command `node client.js [name]`, where name is the client's handle. If the server has not started yet, the client retries and he cannot send messages until the connection is established.

Each client, can send a message to another user with the format `[handle]: [message]`.

Additional commands supported are:

-   `list-users`: The server sends all the client names connected.
-   `history [N]`: Show the last `N` messages of the conversation.
-   `exit`: Exit the application.

There are also 2 Docker scripts (build/run) to build and run the application server in Docker.
