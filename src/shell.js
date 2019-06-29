import Veczor from './modules/veczor';


const VECTORS = [
  'assets/demo/1.svg',
  'assets/demo/2.svg',
  'assets/demo/3.svg',
  'assets/demo/4.svg',
  'assets/demo/5.svg',
  'assets/demo/6.svg',
  'assets/demo/7.svg',
  'assets/demo/8.svg',
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
  experiment.velocity += 0.001;
  experiment.update();
  manipulator.textContent = `${Math.round(experiment.velocity * 100) / 100}`;

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
  setVelocity(event.acceleration.y);
}

function mouseWheel(event) {
  event.preventDefault();
  setVelocity(event.deltaY);
}

function setVelocity(delta) {
  experiment.velocity += (delta / 100);
}

function pointermove(event) {
  const { x, y } = event;

  experiment.position = { x, y };
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
      experiment.distort(10);
      break;
    case('w'):
      experiment.followPointer = !experiment.followPointer;
      break;
    case ('e'):
      experiment.idleEnergy = experiment.idleEnergy ? 0 : 0.05;
      break;
    case ('r'):
      const color = Veczor.createNeonColor(0, canvas.height);
      experiment.color = color;
      break;
  }
}


start();
