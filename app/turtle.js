
const turtleWidth = 20;
const turtleHeight = 20;
const turtleWidthOffset = turtleWidth / 2;
const turtleHeightOffset = turtleHeight / 2;

let currentPosX, currentPosY, width, height, img, ctx, angle = 0;
let myImageData;

const convertDegToRad = a => a * Math.PI / 180;

const getTurtleStartXPos = () => currentPosX - turtleWidthOffset;
const getTurtleStartYPos = () => currentPosY - turtleHeightOffset;

const getTurtleCenterXPos = () => getTurtleStartXPos() + turtleWidthOffset;
const getTurtleCenterYPos = () => getTurtleStartYPos() + turtleHeightOffset;


const drawLine = (fromX, fromY, toX, toY) => {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
};

const linearMove = (arg, forward) => {
  let radAngle = convertDegToRad(angle);
  let finalPosY = currentPosY - Math.cos(radAngle) * arg * forward;
  let finalPosX = currentPosX + Math.sin(radAngle) * arg * forward;
  drawLine(currentPosX, currentPosY, finalPosX, finalPosY);
  currentPosX = finalPosX;
  currentPosY = finalPosY;
};

const drawTurtle = () => {
  ctx.save();
  ctx.putImageData(myImageData, 0, 0);
  ctx.translate( getTurtleCenterXPos(), getTurtleCenterYPos() );
  ctx.rotate( convertDegToRad(angle) );
  ctx.translate( -turtleWidthOffset, -turtleHeightOffset);
  putTurtleOnCanvas(0,0);
  ctx.restore();
};

const putTurtleOnCanvas = (turtleStartX = getTurtleStartXPos(), turtleStartY = getTurtleStartYPos()) => {
  ctx.drawImage(img, turtleStartX, turtleStartY, turtleWidth, turtleHeight);
};

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

const resetTurtlePosition = () => {
  currentPosX = width/2;
  currentPosY = height/2;
  angle = 0;
};

const switchOffRepeating = () => {
  repeating = false;
  myImageData = ctx.getImageData(0, 0, width, height);
  drawTurtle();
};

const switchOnRepeating = () => {
  repeating = true;
  ctx.putImageData(myImageData, 0, 0);
};

const cs = () => {
  ctx.clearRect(0, 0, width, height);
  resetTurtlePosition();
  myImageData = ctx.getImageData(0, 0, width, height);
  putTurtleOnCanvas();
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

  cs: cs,

  repeating: switchOnRepeating,

  switchOffRepeating: switchOffRepeating,

  execute: function(commandName, argList) {
    let command = this[commandName];
    (typeof command === 'object' ? (repeating ? command.withRepeat : command.noRepeat) : command)(...argList);
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
    putTurtleOnCanvas();
  }
};

module.exports = turtle;
