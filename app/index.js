document.addEventListener("DOMContentLoaded", function() {
  require('./dom')();
});

const turtle = require('./turtle');
const width = 1000, height = 500;

let canvas = document.getElementById('canvas');
canvas.width  = width;
canvas.height = height;
let ctx = canvas.getContext('2d');

let img = new Image();
img.onload = function() {
  turtle.init(width, height, img, ctx);
};

img.src = "turtle.jpg";
