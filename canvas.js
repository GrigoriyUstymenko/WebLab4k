'use strict';

const playButton = document.querySelector('.play-button');
const closeButton = document.querySelector('.close-button');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');
const reloadButton = document.querySelector('.reload-button');
const square = document.querySelector('.square');
const work = document.querySelector('.work');
const animEl = document.querySelector('.anim');
const anim = animEl.getContext('2d');
animEl.setAttribute('width', window.innerWidth * 0.65 - 10 + 'px');
animEl.setAttribute('height', window.innerHeight * 0.75 - 50 + 'px');
anim.fillStyle = 'lawngreen';

let options;
let  squareSide, radius;

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
let x, y;

playButton.addEventListener('click', () => {
  playButton.disabled = true;
  startButton.style.display = 'block';
  stopButton.style.display = 'none';
  reloadButton.style.display = 'none';
  work.style.display = 'block';

  anim.clearRect(0, 0, animEl.width, animEl.height);
  x = animEl.width - squareSide;
  y = 0;
  anim.fillRect(x, y, squareSide, squareSide);
});

closeButton.addEventListener('click', () => {
  work.style.display = 'none';
  playButton.disabled = false;
  dx = 0;
  dy = 0;
  clearInterval(squareInterval);
});

const moveObject = () => {
  anim.clearRect(0, 0, animEl.width, animEl.height);
  x += dx;
  y += dy;
  anim.fillRect(x, y, squareSide, squareSide);
};

const controlMovement = () => {
  if(x + dx > animEl.width) {
    dx = -dx;
  }
  if(y + dy > animEl.height || y + dy < 0) {
    dy = -dy;
  }

  if (x + dx < 0) {
    startButton.style.display = 'none';
    stopButton.style.display = 'none';
    reloadButton.style.display = 'block';
    clearInterval(squareInterval);
    anim.clearRect(0, 0, animEl.width, animEl.height);
    return;
  }
  moveObject();
};

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  reloadButton.style.display = 'none';
  stopButton.style.display = 'block';
  if (!dx && !dy){
    const angle = Math.random() * (Math.PI * (3 / 2) - Math.PI) + Math.PI;
    dx = Math.cos(angle) * radius;
    dy = - Math.sin(angle) * radius;
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

  x = animEl.width - squareSide;
  y = 0;
  anim.fillRect(x, y, squareSide, squareSide);
  dx = 0;
  dy = 0;
});
