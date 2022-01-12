'use strict';

const playButton = document.querySelector('.play-button');
const closeButton = document.querySelector('.close-button');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');
const reloadButton = document.querySelector('.reload-button');
const square = document.querySelector('.square');
const work = document.querySelector('.work');
const anim = document.querySelector('.anim');
const logText = document.querySelector('.log-text');
const smallRight = document.querySelector('.small-right');

let options;
let animBorderWidth;
let squareSide;
let radius;

const recordLog = (message) => {
  logText.innerHTML = message;
  const date = JSON.stringify(new Date());
  const logs = JSON.parse(localStorage.getItem('logs')) ?? [];
  logs.push(`${date}: ${message}`);
  localStorage.setItem('logs', JSON.stringify(logs));
}

const emptyLog = () => {
  const logs = JSON.parse(localStorage.getItem('logs')) ?? [];
  smallRight.innerHTML = logs.join('\n');
  localStorage.removeItem('logs');
}

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
    animBorderWidth = +options.animBorderWidth;
    squareSide = +options.squareSide;
    radius = +options.movementRadius;
  } catch (responseErr) {
    const messageText = responseErr.message || 'An unknown error occurred!';
    alert(messageText);
  }
}

loadItems();
let squareInterval;
let dx = 0;
let dy = 0;
localStorage.clear();

playButton.addEventListener('click', () => {
  recordLog('Play button pressed');
  recordLog('Work field shown');

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
  recordLog('Close button pressed');
  recordLog('Work field closed');
  emptyLog();

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
    recordLog('The square bumped into the right panel');
    dx = -dx;
  }

  if (objRect.top < animRect.top + animBorderWidth) {
    recordLog('The square bumped into the top panel');
    dy = -dy;
  }

  if (objRect.bottom > animRect.bottom - animBorderWidth) {
    recordLog('The square bumped into the bottom panel');
    dy = -dy;
  }

  if (objRect.left < animRect.left + animBorderWidth) {
    recordLog('The square left the field');

    startButton.style.display = 'none';
    stopButton.style.display = 'none';
    reloadButton.style.display = 'block';
    square.style.display = 'none';
    clearInterval(squareInterval);
  }

  moveObject(object);
};

startButton.addEventListener('click', () => {
  recordLog('Start button pressed');

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
  recordLog('Stop button pressed');

  startButton.style.display = 'block';
  reloadButton.style.display = 'none';
  stopButton.style.display = 'none';
  clearInterval(squareInterval);
});

reloadButton.addEventListener('click', () => {
  recordLog('Reload button pressed');

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
