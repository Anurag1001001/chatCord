const socket = io();

// catch the events fired from server side
socket.on('message', message =>{
    console.log(message);

})