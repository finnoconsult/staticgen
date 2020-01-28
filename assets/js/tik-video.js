const videoTag = document.querySelector('.tik');
const playButton = document.querySelector('.videoOverlay');

playButton.addEventListener('click', function(event) {
  event.preventDefault();
  if (videoTag.paused) {
    videoTag.play();
    playButton.style.opacity = 0;
  } else {
    videoTag.pause();
    playButton.style.opacity = 1;
  }
})