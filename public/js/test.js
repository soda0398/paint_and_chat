var pressed = false;
//var socket = io("http://localhost:5000");
var socket = io(window.location.origin);
let canvas = document.getElementById("myCanvas");
let pencolor = document.getElementById("pen_color");
let lastX = 0;
let lastY = 0;

function draw(x, y, event) {
  ctx = canvas.getContext("2d");
  console.log(pencolor.value);
  ctx.strokeStyle = pencolor.value;
  console.log(pencolor.value);
  socket.emit('draw', {
    l_x: lastX,
    l_y: lastY,
    e_x: event.offsetX,
    e_y: event.offsetY,
    pen: pencolor.value
  });

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(event.offsetX, event.offsetY);
  //ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.stroke();
  [lastX, lastY] = [event.offsetX, event.offsetY]
}

function draw_c(l_x, l_y, e_x, e_y, color) {
  ctx = canvas.getContext("2d");
  console.log(color);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(l_x, l_y);
  ctx.lineTo(e_x, e_y);
  //ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.stroke();
}
function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  draw(x, y, event);
}

canvas.addEventListener("mousedown", function (e) {
  pressed = true;
  [lastX, lastY] = [e.offsetX, e.offsetY]
  console.log(pressed);
});
canvas.addEventListener("mouseup", function () {
  pressed = false;
});

canvas.addEventListener("mousemove", function (e) {
  if (pressed == true) {
    getMousePosition(canvas, e);
  }
});

pencolor.addEventListener('change', function () {
  console.log(pencolor.value);

})

document.getElementById("clear").addEventListener("click", function () {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  socket.emit('clear');
});


var send = document.getElementById("send_msg");

send.addEventListener("click", function () {
  let user_name = document.getElementById("user").value;
  let msg = document.getElementById("msg").value;
  let content = document.getElementById("chat_content");
  content.innerHTML += user_name + ":" + msg + "</br>";
  console.log(user_name, msg);

  socket.emit('msg', {
    user: user_name,
    message: msg
  });

  document.getElementById("msg").value = "";
});



//listen for events
socket.on('draw', function (data) {
  console.log(data.l_x, data.l_y, data.e_x, data.e_y)
  draw_c(data.l_x, data.l_y, data.e_x, data.e_y, data.pen);
});

socket.on('color', function (data) {
  pencolor.value = data.color;
});

socket.on('clear', function () {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
});

socket.on('msg', function (data) {
  document.getElementById("chat_content").innerHTML += data.user + ": " + data.message + "</br>";
});