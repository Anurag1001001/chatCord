const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const app = express();

// this actually use by the express under the hood 
const server =  http.createServer(app);
const io = socketio(server);

// set Static folder;
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'chatCord Bot';
// Run when client connects
io.on('connection', socket => {
    // Welcome current User
    socket.emit('message', formatMessage(botName,"Welcome to the Chatcord!"));

    // Broadcast when a user connects
    //  there is a difference in socket.emit(), socket.broadcast.emit(), io.emit() ---> to broadcast to everybody
    socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'));
    // Runs when client disconnects
    socket.on('disconnect', () =>{
        io.emit('message',formatMessage(botName, 'A User has left the chat'));
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message',formatMessage(botName, msg));
    });
});






const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
