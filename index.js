const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();

// this actually use by the express under the hood 
const server =  http.createServer(app);
const io = socketio(server);

// set Static folder;
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
    // Welcome current User
    socket.emit('message', "Welcome to the Chatcord!");

    // Broadcast when a user connects
    //  there is a difference in socket.emit(), socket.broadcast.emit(), io.emit() ---> to broadcast to everybody
    socket.broadcast.emit('message', 'A user has joined the chat');
    // Runs when client disconnects
    socket.on('disconnect', () =>{
        io.emit('message', 'A User has left the chat');
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    })
});






const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
