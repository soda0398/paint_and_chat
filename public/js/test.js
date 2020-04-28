var pressed = false;
var socket = io("http://localhost:3000");
let canvas = document.getElementById("myCanvas");
let pencolor = document.getElementById("pen_color");
let lastX = 0;
let lastY = 0;

function draw(x, y, event) {
  ctx = canvas.getContext("2d");
  console.log(pencolor.value);
  ctx.strokeStyle = pencolor.value;

  socket.emit('draw', {
    l_x: lastX,
    l_y: lastY,
    e_x: event.offsetX,
    e_y: event.offsetY
  });

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(event.offsetX, event.offsetY);
  //ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.stroke();
  [lastX, lastY] = [event.offsetX, event.offsetY]
}

function draw_c(l_x, l_y, e_x, e_y) {
  ctx = canvas.getContext("2d");
  console.log(pencolor.value);
  ctx.strokeStyle = pencolor.value;
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
  socket.emit('color', {
    color: pencolor.value
  });
})

document.getElementById("clear").addEventListener("click", function () {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  socket.emit('clear');
});


//listen for events
socket.on('draw', function (data) {
  console.log(data.l_x, data.l_y, data.e_x, data.e_y)
  draw_c(data.l_x, data.l_y, data.e_x, data.e_y);
});

socket.on('color', function (data) {
  pencolor.value = data.color;
});

socket.on('clear', function () {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
})