'use strict';

const playButton = document.querySelector('.play-button');
const work = document.querySelector('.work');

playButton.addEventListener('click', (event) => {
  event.target.disabled = true;
  work.style.display = 'block';
})
