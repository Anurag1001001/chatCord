const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {userJoin, getCurrentUser,userLeave, getRoomUsers} = require('./utils/users');
const app = express();

// this actually use by the express under the hood 
const server =  http.createServer(app);
const io = socketio(server);

// set Static folder;
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'chatCord Bot';
// Run when client connects
io.on('connection', socket => {

    //  this username and room is coming from URL
    socket.on('joinRoom', ({username, room}) =>{
        const user = userJoin(socket.id, username, room);

        // inbuilt join() function used here
        socket.join(user.room);

        // Welcome current User
        socket.emit('message', formatMessage(botName,"Welcome to the Chatcord!"));

        // Broadcast when a user connects
        //  there is a difference in socket.emit(), socket.broadcast.emit(), io.emit() ---> to broadcast to everybody
        // This is hOw we broadcast to a specific room
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName,`${user.username} has joined the chat`));

        // Send users and room info

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

    })
   
    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io
        .to(user.room)
        .emit('message',formatMessage(user.username, msg));
    });
    // Runs when client disconnects
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        if(user){
            io
            .to(user.room)
            .emit('message',formatMessage(user.username, `${user.username} has left the chat`));

            // Send users and room info

            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    });

});






const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
