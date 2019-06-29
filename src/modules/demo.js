import Veczor from './veczor';
import VeczorGUI from './veczor.gui';
import DemoSVG from './svgs';

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const iteration = document.getElementById('iteration');
let experiment = null;
let gui = null;
let svgs = null;

async function start() {
  svgs = await loadAllFiles();

  if (!window.PointerEvent) {
    await import('pepjs');
  }

  const svg = svgs[Math.floor(Math.random() * svgs.length)];

  experiment = new Veczor(canvas, svg);
  gui = new VeczorGUI(experiment);

  window.addEventListener('resize', resize, { passive: true });

  setup();

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', deviceMotion, { passive: true });
  }

  resize();
  loop();
}

function setup() {
  canvas.addEventListener('wheel', mouseWheel, { passive: true });
  canvas.addEventListener('pointermove', pointerMove, { passive: true });
  canvas.addEventListener('pointerdown', click, { passive: true });
}

async function loadAllFiles() {
  const svgs = [];

  DemoSVG.forEach((svg, index) => svgs[index] = Veczor.removeSVGViewBox(svg));

  return svgs;
}

function loop() {
  if (gui.idleVelocity) {
    experiment.velocity += 0.1;
  }
  iteration.textContent = `${Math.round(experiment.velocity * 100) / 100}`;

  experiment.update();
  requestAnimationFrame(loop);
}

async function click(event) {
  const isLeftClick = event.pointerType === 'mouse' && event.button === 0;
  if (isLeftClick || event.pointerType === 'touch') {
    experiment.svg = svgs[Math.floor(Math.random() * svgs.length)];

    resize();
  }
}

function deviceMotion(event) {
  setVelocity(event.acceleration.y);
}

function mouseWheel(event) {
  setVelocity(event.deltaY);
}

function setVelocity(delta) {
  experiment.velocity += (delta / 10);
}


function pointerMove({ x, y }) {
  experiment.position = {
    x,
    y,
  };
}

function resize() {
  const padding = canvas.width > canvas.height ? canvas.height / 8 : canvas.width / 8;
  experiment.fit(padding);
  experiment.center();
}


start();
