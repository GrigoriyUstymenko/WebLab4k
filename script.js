'use strict';

const playButton = document.querySelector('.play-button');
const closeButton = document.querySelector('.close-button');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');
const reloadButton = document.querySelector('.reload-button');
const square = document.querySelector('.square');
const work = document.querySelector('.work');
const anim = document.querySelector('.anim');

let options;
let animBorderWidth;
let squareSide;
let radius;
const loadItems = async () => {
  try {
    const response = await fetch('/api/getOptions', {
      method: 'GET'
    });
    if (!response.ok) {
      const res = await response.json();
      const errText = res.errors?.length
        ? res.errors[0].title + ': ' + res.errors[0].detail
        : 'An unknown error occurred!';
      throw new Error(errText);
    }
    options = await response.json();
    console.log(options);
    animBorderWidth = +options.animBorderWidth;
    squareSide = +options.squareSide;
    radius = +options.radius;
  } catch (responseErr) {
    const messageText = responseErr.message || 'An unknown error occurred!';
    alert(messageText);
  }
}

loadItems();
let squareInterval;
let dx = 0;
let dy = 0;

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
  dx = 0;
  dy = 0;
  clearInterval(squareInterval);
});

const moveObject = (object) => {
  const rect = object.getBoundingClientRect();
  const x = rect.left + dx;
  const y = rect.top + dy;
  object.style.top = `${y}px`;
  object.style.left = `${x}px`;
};

const controlMovement = (object) => {
  const objRect = object.getBoundingClientRect();
  const animRect = anim.getBoundingClientRect();

  if (objRect.right > animRect.right - animBorderWidth) {
    dx = -dx;
  }

  if (objRect.top < animRect.top + animBorderWidth) {
    dy = -dy;
  }

  if (objRect.bottom > animRect.bottom - animBorderWidth) {
    dy = -dy;
  }

  if (objRect.left < animRect.left + animBorderWidth) {
    startButton.style.display = 'none';
    stopButton.style.display = 'none';
    reloadButton.style.display = 'block';
    square.style.display = 'none';
    clearInterval(squareInterval);
  }

  moveObject(object);
};

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  reloadButton.style.display = 'none';
  stopButton.style.display = 'block';
  if (!dx && !dy){
    const angle = Math.random() * (Math.PI * (3 / 2) - Math.PI) + Math.PI;
    console.log(angle);
    dx = Math.cos(angle) * radius;
    console.log(dx);
    dy = - Math.sin(angle) * radius;
    console.log(dy);
  }

  squareInterval = setInterval(controlMovement, 1, square);
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
  dx = 0;
  dy = 0;
});
