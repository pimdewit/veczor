const canvas = document.getElementById('canvas');

async function start() {
  loop();
}

function loop() {
  requestAnimationFrame(loop);
}

function resize() {
}
