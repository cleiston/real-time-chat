const socket = io('http://localhost:3000')
const messageForm = document.getElementById('send-container')
const messageContainer = document.getElementById('message-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined', 'system')
socket.emit('new-user', name) // emit 'new user' to users connected to the server

/* Handling messages from server */

socket.on('user-connected', name => {
    appendMessage(`${name} connected`, 'system')
})

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`, 'system')
})

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`, 'them')
})

/* Handling on submit form */

messageForm.addEventListener('submit', e => {
    e.preventDefault() // prevents refreshing page
    const message = messageInput.value 
    appendMessage(`You: ${message}`, 'me') // append message locally
    socket.emit('send-chat-message', message)   // emit message to all other users
    messageInput.value = '' // clear input box after message sent
})

/* Styling new messages to the chat accordingly */

function appendMessage(message, from) {
    const messageElement = document.createElement('div')
    messageElement.className = from
    messageElement.id = 'message'
    messageElement.innerText = message
    messageContainer.append(messageElement)
    window.scrollTo(0, messageContainer.scrollHeight); // scroll to the bottom, showing the latest messages
}