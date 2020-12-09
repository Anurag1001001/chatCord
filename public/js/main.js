const chatForm = document.getElementById( 'chat-form');
const chatMessage = document.querySelector('.chat-messages');

const socket = io();
// Message from server
// catch the events fired from server side
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    // Scroll down (Whenever a new message comes we'll be able to see right there we don't need to scroll down to see what new message comes)
    // comment this and see the difference

    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();
    // Get message Text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // clear input( AFter emitting the message i want to clear the text area and also want to be focus on the textarea);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}