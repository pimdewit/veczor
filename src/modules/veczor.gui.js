import Veczor from './veczor';


const CONFIG_ELEMENTS = {
  DISTORT: document.getElementById('distort'),
  FOLLOW_POINTER: document.getElementById('follow-pointer'),
  ANIMATE: document.getElementById('animate'),
  BLEND_MODE: document.getElementById('blend-mode'),
  COLOUR: document.getElementById('random-color'),

  DASH_LENGTH: document.getElementById('dash-length'),
  DASH_LENGTH_OUTPUT: document.getElementById('dash-length-output'),

  DASH_GAP: document.getElementById('dash-gap'),
  DASH_GAP_OUTPUT: document.getElementById('dash-gap-output'),

  THICKNESS: document.getElementById('thickness'),
  THICKNESS_OUTPUT: document.getElementById('thickness-output'),

  EXPORT: document.getElementById('export'),
};


class VeczorGUI {
  constructor(veczorInstance) {
    this._veczor = veczorInstance;
    this.idleVelocity = 0.1;

    this.distort = this.distort.bind(this);
    this.followPointer = this.followPointer.bind(this);
    this.animate = this.animate.bind(this);
    this.blendMode = this.blendMode.bind(this);
    this.color = this.color.bind(this);
    this.dashLength = this.dashLength.bind(this);
    this.dashGap = this.dashGap.bind(this);
    this.thickness = this.thickness.bind(this);
    this.exportToFile = this.exportToFile.bind(this);
    this.keydown = this.keydown.bind(this);

    document.addEventListener('keydown', this.keydown);

    CONFIG_ELEMENTS.DISTORT.addEventListener('click', this.distort, false);
    CONFIG_ELEMENTS.FOLLOW_POINTER.addEventListener('click', this.followPointer, false);
    CONFIG_ELEMENTS.ANIMATE.addEventListener('input', this.animate, false);
    CONFIG_ELEMENTS.BLEND_MODE.addEventListener('input', this.blendMode, false);
    CONFIG_ELEMENTS.COLOUR.addEventListener('click', this.color, false);

    CONFIG_ELEMENTS.DASH_LENGTH.addEventListener('input', this.dashLength, false);
    CONFIG_ELEMENTS.DASH_GAP.addEventListener('input', this.dashGap, false);

    CONFIG_ELEMENTS.THICKNESS.addEventListener('input', this.thickness, false);

    CONFIG_ELEMENTS.EXPORT.addEventListener('click', this.exportToFile, false);
  }

  distort() {
    this._veczor.distort(10);
  }

  followPointer() {
    this._veczor.followPointer = !this._veczor.followPointer;
  }

  animate(event) {
    this.idleVelocity = event.target.checked ? 0.1 : 0;
  }

  blendMode(event) {
    this._veczor.blendMode = event.target.value;
  }

  color() {
    this._veczor.color = Veczor.createNeonColor(0, canvas.height);
  }

  dashLength(event) {
    const { value } = event.target;
    CONFIG_ELEMENTS.DASH_LENGTH_OUTPUT.textContent = value;
    this._veczor.dashLength = value;
  }

  dashGap(event) {
    const { value } = event.target;
    CONFIG_ELEMENTS.DASH_GAP_OUTPUT.textContent = value;
    this._veczor.dashGap = value;
  }

  thickness(event) {
    const { value } = event.target;
    CONFIG_ELEMENTS.THICKNESS_OUTPUT.textContent = value;
    this._veczor.strokeWidth = value;
  }

  exportToFile() {
    this._veczor.exportToFile();
  }

  keydown({ key }) {
    switch (key) {
      case 's':
        this.exportToFile();
        break;
      case '1':
        this.distort();
        break;
      case '2':
        this.followPointer();
        break;
      case '3':
        this.idleVelocity = this.idleVelocity ? 0 : 0.1;
        break;
      case '4':
        this.color();
        break;
    }
  }
}


export default VeczorGUI;
