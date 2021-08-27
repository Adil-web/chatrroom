let users = []

// join user to chat

function userJoin(id, username, room) {
    const user = {id, username, room}
    users.push(user)
    return user
}

// user leave the chat
function userLeave(id) {
    users = users.filter(user => user.id !== id)
}

// get current user
function getUser(id) {
    return users.find(user => user.id === id)
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    userLeave,
    getUser,
    getRoomUsers
}
