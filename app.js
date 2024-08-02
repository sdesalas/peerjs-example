const crypto = require('crypto');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');

const port = process.env.PORT || 3030;
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.set('view engine', 'ejs');
app.use('/peerjs', peerServer);
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.redirect(`/chat/${crypto.randomBytes(3).toString('hex')}`);
});
app.get('/chat/:room', (req, res) => {
  console.log('get /:room', req.params
  );
    res.render('room', { roomId: req.params.room });
});
io.on('connection', (socket) => {
    // socket.on('join-room', (roomId, userId, username) => {
    //   console.log('join-room', roomId, userId);
    //   socket.join(roomId);
    //   io.to(roomId).timeout(5000).emit('user-connected', userId);
    //   console.log(`${roomId}: user connected (${username})`)
    // });
    socket.on("join-room", (roomId, userId, username) => {
      socket.join(roomId);
      setTimeout(()=>{
        io.to(roomId).timeout(5000).emit('user-connected', userId);
        console.log(`${roomId}: user connected (${username})`)
        // socket.to(roomId).broadcast.emit("user-connected", userId);
      }, 1000)
      socket.on("message", (message) => {
        io.to(roomId).emit("createMessage", message, username);
      });
    });
});
server.listen(port, () => console.log(`Running on port ${port}...`));
