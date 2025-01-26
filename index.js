// const io = require('socket.io')(3000)
//or
// const io = require('socket.io')(3000, {
//     cors: {
//         origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow both localhost and 127.0.0.1
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Content-Type"],  // Optionally add headers if needed
//         credentials: true
//     }
// });
//or
const io = require('socket.io')(3000, {
    cors: {
        origin: "*",  // Allow all origins (for testing purposes only)
        methods: ["GET", "POST"]
    }
});

 


const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        if(name){
            // console.log("New user joined:", name);
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        }
    });

    socket.on('send', (message) => {
        const timestamp = new Date().toISOString();
        socket.broadcast.emit('receive', { message, name: users[socket.id], timestamp });
        // socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });


    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        }
    }); 
});
