const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

var socket = require('socket.io');
const path = require('path');

console.log(__dirname);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

var server = app.listen(port, function () {
  console.log("connection on Port:" + `${port}`);
});
app.use('/public', express.static(__dirname + '/public'));





var io = socket(server);

io.on('connection', function (socket) {
  console.log("made socket connection");


  socket.on('draw', function (data) {
    //console.log("X:", data.x, "Y:", data.y);
    socket.broadcast.emit('draw', data);
  });

  socket.on('color', function (data) {
    socket.broadcast.emit('color', data);
  });

  socket.on('clear', function () {
    socket.broadcast.emit('clear');
  });

  socket.on('msg', function (data) {
    socket.broadcast.emit('msg', data);

  })
});
