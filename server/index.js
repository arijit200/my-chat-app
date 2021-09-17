const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());

io.on('connection', (socket) => {
    // console.log('We have a new connection !!');
    
    socket.on('join', ({name, room}, callback) => {
        // console.log(name, room);
        const { error, user } = addUser({ id: socket.id, name, room });// here id is an socket id

        //if error is true
        if(error) return callback(error);
        //otherwise join the user to the room
        socket.join(user.room);

        socket.emit('message',{ user: 'admin', text : `${user.name}, Welcome to the room ${user.room}` });
        //now to laert all other users present in the room that a new user has joined we use broadcast

        socket.broadcast.to(user.room).emit('message', { user: 'admin', text : `${user.name} has joined`});

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message', { user : user.name, text : message});
        callback();
    });


    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});

server.listen(PORT, () => {
    console.log(`Port has started on port ${PORT}`);
});
