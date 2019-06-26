import Veczor from './modules/veczor';


const url = 'assets/square7.svg';
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const manipulator = document.getElementById('manipulator');
let experiment = null;

async function start() {
  const response = await fetch(url);
  const svg = await response.text();

  experiment = new Veczor(canvas, svg);

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('keydown', keydown, false);
  canvas.addEventListener('mousewheel', mousewheel, false);
  canvas.addEventListener('pointermove', pointermove, { passive: true });
  canvas.addEventListener('pointerdown', click, { passive: true });

  resize();

  loop();
}

function loop() {
  experiment.update();
  manipulator.textContent = `${Math.round(experiment.timer * 100) / 100}`;

  requestAnimationFrame(loop);
}

function click() {
  // experiment.shufflePoints();
}

function mousewheel(event) {
  console.log(event);
  event.preventDefault();

  experiment.timer += (event.deltaY / 100);
}

function pointermove(event) {
  const { x, y } = event;

  experiment.pointermove(x, y);
}

function resize() {
  experiment.resize();
}

function keydown({ key }) {
  switch (key) {
    case(' '):
      experiment.exportAsSVG();
      break;
    case('q'):
      experiment.shufflePoints();
      break;
    case('w'):
      experiment.followPointer = !experiment.followPointer;
      break;
    case ('e'):
      experiment.animate = !experiment.animate;
      break;
  }
}


start();
