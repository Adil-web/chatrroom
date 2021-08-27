const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.querySelector("#room-name")
const usersList = document.querySelector("#users")
const socket = io()

// Get username, room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// Join to chat
socket.emit("joinRoom", { username, room })

// Get room users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room)
  outputUsers(users)
})

// Msg from server
socket.on("message", msg => {
  console.log(msg)
  outputMessage(msg)

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const msg = e.target.elements.msg.value
  if(msg.trim()) {
    socket.emit("chatMsg", msg)
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
  }
})

function outputMessage(msg) {
  const div = document.createElement("div")
  div.classList.add("message")
  div.innerHTML = `<p class="meta">${msg.name} <span>${msg.time}</span></p>
  <p class="text">${msg.text}</span></p>`
  document.querySelector(".chat-messages").appendChild(div)
}

function outputRoomName(room) {
  roomName.innerHTML = room
}

function outputUsers(users) {
  usersList.innerHTML = 
  `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}
