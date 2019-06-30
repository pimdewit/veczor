import Veczor from './veczor';
import VeczorGUI from './veczor.gui';
import DemoSVG from './svgs';


const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const iteration = document.getElementById('iteration');

const presets = document.querySelectorAll('[data-preset]');

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
  // canvas.addEventListener('mousemove', pointerMove, { passive: true });
  // canvas.addEventListener('touchmove', pointerMove, { passive: true });
  // canvas.addEventListener('pointerdown', click, { passive: true });
  presets.forEach(preset => preset.addEventListener('click', initPresets, { passive: true }));
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


function cartography() {
  experiment.svg = svgs[2];
  experiment.dashLength = 100;
  experiment.dashGap = 10;
  experiment.strokeWidth = 1;
  experiment.blendMode = 'screen';
  experiment._elements.forEach(element => {
    element.dashArray = [
      Math.random() * 10,
      Math.random() * 100,
    ];
  });
  experiment.distort(100);
}

function fireworks() {
  experiment.svg = svgs[4];
  experiment.strokeWidth = 10;
  experiment.blendMode = 'screen';
  experiment._elements.forEach(element => {
    element.strokeColor = '#f2f3f4';
    element.dashArray = [
      (Math.random() * 50) + 25,
      (Math.random() * 500) + 250,
    ];
  });
  experiment.distort(1000);
  experiment.followPointer = false;
  experiment.center();
}

function vaporwave() {
  experiment.svg = svgs[5];
  experiment.strokeWidth = 20;
  experiment.blendMode = 'screen';
  experiment.dashLength = 1000;
  experiment.dashGap = 100;
  experiment._elements.forEach(element => {
    element.strokeColor = Veczor.createNeonColor(0, 4000, 180, 120);
  });
  experiment.distort(50);
  experiment.followPointer = false;
  experiment.distort(200);
  experiment.center();
}

function vivaPinata() {
  experiment.svg = svgs[6];
  experiment.strokeWidth = 4;
  experiment.blendMode = 'screen';
  experiment.dashLength = 1000;
  experiment.dashGap = 256;
  experiment._elements.forEach(element => {
    element.strokeColor = Veczor.createNeonColor(0, 1, -80, 160);
  });
  experiment.followPointer = false;

  if (experiment.position.x === -1) {
    experiment.position.x = canvas.width / 4;
    experiment.position.y = canvas.height / 4;
  }

  experiment.followPointer = true;
}

function mehndi() {
  experiment.followPointer = false;
  experiment.svg = svgs[7];
  experiment.strokeWidth = 2;
  experiment.blendMode = 'normal';
  experiment.dashLength = Math.random() * 512;
  ;
  experiment.dashGap = Math.random() * 512;
  experiment._elements.forEach(element => {
    element.strokeColor = Veczor.createNeonColor(0, 1, -80, 160);
  });
}

function initPresets(event) {
  const preset = event.target.dataset.preset;

  switch (preset) {
    case 'cartography':
      cartography();
      break;
    case 'fireworks':
      fireworks();
      break;
    case 'vaporwave':
      vaporwave();
      break;
    case 'vivaPinata':
      vivaPinata();
      break;
    case 'mehndi':
      mehndi();
      break;
  }

  resize();
}


start();
