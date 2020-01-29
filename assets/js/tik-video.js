const video = document.querySelector('.tik');
const videControls = document.querySelector('.videoOverlay')
const playButton = document.querySelector('.videoOverlay');
const muteButton = document.querySelector('.muteButton');

playButton.addEventListener('click', function(event) {
  event.preventDefault();
  if (video.paused) {
    video.play();
    playButton.style.opacity = 0;
  } else {
    video.pause();
    playButton.style.opacity = 1;
  }
})

muteButton.addEventListener('click', function(event) {
  event.preventDefault();
  if (muteButton.classList.contains('muteButtonDisableSound')) {
    muteButton.classList.remove('muteButtonDisableSound');
    muteButton.classList.add('muteButtonEnableSound');
    video.muted = true;
  } else {
    muteButton.classList.remove('muteButtonEnableSound');
    muteButton.classList.add('muteButtonDisableSound');
    video.muted = false;
  }
})

videControls.addEventListener('mouseenter', function(event) {
  event.preventDefault();
  muteButton.classList.remove('muteButtonHidden');
  muteButton.classList.add('muteButtonShown');
})

muteButton.addEventListener('mouseenter', function(event) {
  event.preventDefault();
  muteButton.classList.remove('muteButtonHidden');
  muteButton.classList.add('muteButtonShown');
})

videControls.addEventListener('mouseleave', function(event) {
  event.preventDefault();
  muteButton.classList.remove('muteButtonShown');
  muteButton.classList.add('muteButtonHidden');
})