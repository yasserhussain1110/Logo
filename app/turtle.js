const xDiff = 13;
const yDiff = 23;

let currentPosX, currentPosY, width, height, img, ctx, angle = 0;
let myImageData;

const convertDegToRad = a => a * Math.PI / 180;

const getTurtleStartXPos = () => currentPosX - xDiff;
const getTurtleStartYPos = () => currentPosY - yDiff;

const getTurtleCenterXPos = () => getTurtleStartXPos() + img.naturalWidth / 2;
const getTurtleCenterYPos = () => getTurtleStartYPos() + img.naturalHeight / 2;


function drawLine(fromX, fromY, toX, toY) {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}

function linearMove(arg, forward) {
  let radAngle = convertDegToRad(angle);
  let finalPosY = currentPosY - Math.cos(radAngle) * arg * forward;
  let finalPosX = currentPosX + Math.sin(radAngle) * arg * forward;
  drawLine(currentPosX, currentPosY, finalPosX, finalPosY);
  currentPosX = finalPosX;
  currentPosY = finalPosY;
}

function drawTurtle() {
  ctx.save();
  ctx.translate( getTurtleCenterXPos(), getTurtleCenterYPos() );
  ctx.rotate( convertDegToRad(angle) );
  ctx.translate( -img.naturalWidth / 2, -img.naturalHeight / 2 );
  ctx.drawImage( img, 0, 0 );
  ctx.restore();
}

let repeating = false;

const withCanvasSaves = f => arg => {
  ctx.putImageData(myImageData, 0, 0);
  f(arg);
  myImageData = ctx.getImageData(0, 0, width, height);
};

const withDrawTurtle = f => arg => {
  f(arg);
  drawTurtle();
};

const turtle = {
  fd: {
    noRepeat: withDrawTurtle(withCanvasSaves(arg => linearMove(arg, 1))),
    withRepeat: arg => linearMove(arg, 1)
  },

  bk: {
    noRepeat: withDrawTurtle(withCanvasSaves(arg => linearMove(arg, -1))),
    withRepeat: arg => linearMove(arg, -1)
  },

  rt: {
    noRepeat: withDrawTurtle(arg => angle+= arg),
    withRepeat: arg => angle += arg
  },

  lt: {
    noRepeat: withDrawTurtle(arg => angle-= arg),
    withRepeat: arg => angle -= arg
  },

  repeating: function() {
    repeating = true;
    ctx.putImageData(myImageData, 0, 0);
  },

  switchOffRepeating: function() {
    repeating = false;
    myImageData = ctx.getImageData(0, 0, width, height);
    drawTurtle();
  },

  execute: function(commandName, argList) {
    let command = this[commandName];
    (repeating ? command.withRepeat : command.noRepeat)(argList[0]);
  },

  init: function(w, h, image, context) {
    width = w;
    height = h;
    currentPosX = w/2;
    currentPosY = h/2;
    img = image;
    ctx = context;
    angle = 0;

    myImageData = ctx.getImageData(0, 0, width, height);
    ctx.drawImage(img, getTurtleStartXPos(), getTurtleStartYPos());
  }
};

module.exports = turtle;
