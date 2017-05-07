/**
 * To get inline styles install 'css-loader' and 'style-loader'.
 * And add those two loaders in exports.setupCSS funtion of 'parts.js'
 */

document.addEventListener("DOMContentLoaded", function() {
  require('./dom')();
});

const turtle = require('./turtle');
const height = 650, width = 600;

let canvas = document.querySelector('canvas');
canvas.height = height;
canvas.width = width;
let ctx = canvas.getContext('2d');

let img = new Image();
img.onload = function() {
  turtle.init(canvas.width, canvas.height, img, ctx);
};

img.src = "turtle.png";
