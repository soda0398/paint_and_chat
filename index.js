var express = require('express');
var socket = require('socket.io');
var app = express();
const path = require('path');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
var server = app.listen(12345, function () {
  console.log("hello,dum dum");
});

app.use(express.static('public'));

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
});
