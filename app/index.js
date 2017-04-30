let canvas = document.getElementById('canvas');
canvas.width  = 1000;
canvas.height = 500;
let ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(300,150);
ctx.lineTo(400,150);
ctx.stroke();
ctx.closePath();

let img = new Image();
img.onload = function() {
  ctx.drawImage(img, 0, 0);
};

img.src = "turtle.jpg";
