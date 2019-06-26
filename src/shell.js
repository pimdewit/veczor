import Veczor from './modules/veczor';


const VECTORS = [
  'assets/square.svg',
  'assets/square3.svg',
  'assets/square4.svg',
  'assets/square5.svg',
  'assets/square6.svg',
  'assets/square7.svg',
];

const url = VECTORS[Math.floor(Math.random() * VECTORS.length)];
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const manipulator = document.getElementById('manipulator');
let experiment = null;

async function start() {
  const svg = await Veczor.loadSVG(url);

  experiment = new Veczor(canvas, svg);

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('keydown', keydown, false);
  canvas.addEventListener('mousewheel', mouseWheel, false);
  canvas.addEventListener('pointermove', pointermove, { passive: true });
  canvas.addEventListener('pointerdown', click, { passive: true });

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', deviceMotion, false);
  }

  resize();
  loop();
}

function loop() {
  experiment.update();
  manipulator.textContent = `${Math.round(experiment.timer * 100) / 100}`;

  requestAnimationFrame(loop);
}

async function click(event) {
  if (event.pointerType === 'mouse' && event.button === 0) {
    const url = VECTORS[Math.floor(Math.random() * VECTORS.length)];
    experiment.svg = await Veczor.loadSVG(url);

    resize();
  }
}

function deviceMotion(event) {
  manipulateTimer(event.acceleration.y);
}

function mouseWheel(event) {
  event.preventDefault();
  manipulateTimer(event.deltaY);
}

function manipulateTimer(delta) {
  experiment.timer += (delta / 100);
}

function pointermove(event) {
  const { x, y } = event;

  experiment.pointer = {x, y};
}

function resize() {
  experiment.center();
}

function keydown({ key }) {
  switch (key) {
    case(' '):
      experiment.exportToFile();
      break;
    case('q'):
      experiment.distort();
      break;
    case('w'):
      experiment.followPointer = !experiment.followPointer;
      break;
    case ('e'):
      experiment.idleEnergy = experiment.idleEnergy ? 0 : 0.05;
      break;
  }
}


start();
