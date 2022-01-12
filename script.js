'use strict';

const playButton = document.querySelector('.play-button');
const closeButton = document.querySelector('.close-button');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');
const reloadButton = document.querySelector('.reload-button');
const square = document.querySelector('.square');
const work = document.querySelector('.work');
const anim = document.querySelector('.anim');

const animBorderWidth = 5;
const squareSide = 10;
let squareInterval;
let angle;

playButton.addEventListener('click', () => {
  playButton.disabled = true;
  startButton.style.display = 'block';
  stopButton.style.display = 'none';
  reloadButton.style.display = 'none';
  work.style.display = 'block';
  square.style.display = 'block';

  const rect = anim.getBoundingClientRect();
  square.style.top = `${rect.top + animBorderWidth}px`;
  square.style.left = `${rect.right - animBorderWidth - squareSide}px`;
});

closeButton.addEventListener('click', () => {
  work.style.display = 'none';
  playButton.disabled = false;
  angle = undefined;
  clearInterval(squareInterval);
});

const moveObject = (object, angle, radius) => {
  const rect = object.getBoundingClientRect();
  const x = rect.left + Math.cos(angle) * radius;
  const y = rect.top - Math.sin(angle) * radius;
  object.style.top = `${y}px`;
  object.style.left = `${x}px`;
};

const controlMovement = (object, radius) => {
  const objRect = object.getBoundingClientRect();
  const animRect = anim.getBoundingClientRect();

  if (objRect.right > animRect.right - animBorderWidth) {
    angle -= (angle - Math.PI) * 2;
  }

  if (objRect.top < animRect.top + animBorderWidth) {
    if(angle > Math.PI*(1/2)) {
      console.log(angle);
      console.log((Math.PI - angle) * 2);
      angle += (Math.PI - angle) * 2;
      console.log(angle)
    }
    angle -= (angle - Math.PI * (3 / 2)) * 2;
  }

  if (objRect.bottom > animRect.bottom - animBorderWidth) {
    if(angle < Math.PI*(3/2)) {
      angle -= (angle - Math.PI) * 2;
    }
    else {
      angle += (Math.PI*2 - angle) * 2;
    }
  }

  if (objRect.left < animRect.left + animBorderWidth) {
    startButton.style.display = 'none';
    stopButton.style.display = 'none';
    reloadButton.style.display = 'block';
    square.style.display = 'none';
    clearInterval(squareInterval);
  }

  moveObject(object, angle, radius);
};

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  reloadButton.style.display = 'none';
  stopButton.style.display = 'block';
  if (angle === undefined)
    angle = Math.random() * (Math.PI * (3 / 2) - Math.PI) + Math.PI;
  squareInterval = setInterval(controlMovement, 1, square, 1);
});

stopButton.addEventListener('click', () => {
  startButton.style.display = 'block';
  reloadButton.style.display = 'none';
  stopButton.style.display = 'none';
  clearInterval(squareInterval);
});

reloadButton.addEventListener('click', () => {
  startButton.style.display = 'block';
  stopButton.style.display = 'none';
  reloadButton.style.display = 'none';
  square.style.display = 'block';

  const rect = anim.getBoundingClientRect();
  square.style.top = `${rect.top + animBorderWidth}px`;
  square.style.left = `${rect.right - animBorderWidth - squareSide}px`;
  angle = undefined;
});
