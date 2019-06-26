import Paper from 'paper';
import { Power3, Power4, TweenLite } from 'gsap/TweenLite';


/**
 * Array containing all possible SVG shape elements.
 * @type {string[]}
 */
export const SVG_SHAPE_ELEMENTS = [
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
];

const STROKE_WIDTH = 2;
const INITIAL_COLOUR = 'white';
const EXPORT_COLOUR = 'black';


function getDistanceBetweenTwoPoints(pointA, pointB) {
  const a = pointA.x - pointB.x;
  const b = pointA.y - pointB.y;

  return Math.sqrt(a * a + b * b);
}


/** Visual experiment. */
class Veczor {
  /**
   * @param {paper.Item} svgElement
   * @return {Array.<paper.Item>}
   */
  static getSVGChildElements(svgElement) {
    const paths = [];

    // return svgElement.children;

    svgElement.children.forEach(group => {
      if (group.children) {
        group.children.forEach(child => {
          child._storedPosition = { x: child.position.x, y: child.position.y };
          paths.push(child);
        });
      }
    });

    paths.reverse();

    return paths;
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {SVGElement} svg
   */
  constructor(canvas, svg) {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this._canvas = canvas;

    /**
     * @type {paper}
     * @private
     */
    this._engine = Paper;

    this._engine.setup(canvas);

    /**
     * @type {paper.Item}
     * @private
     */
    this._svg = this._engine.project.importSVG(svg);

    /**
     * @type {Array<paper.Item>}
     * @private
     */
    this._elements = Veczor.getSVGChildElements(this._svg);

    /**
     * Whether the elements should follow the pointer.
     * @type {boolean}
     * @private
     */
    this._followPointer = false;

    /**
     * @type {number}
     * @private
     */
    this._shuffleSize = 100;

    /**
     * Whether the timer should play
     * @type {boolean}
     * @private
     */
    this._autoTimer = false;

    /** @type {number} */
    this.timer = 0;

    this._svg.scale(2);
    this._svg.dashArray = [25, 10];

    // this._svg.fillColor = '#010101';
    this._svg.strokeWidth = STROKE_WIDTH;
    this._svg.strokeColor = this._getStrokeColour();

    this._elements.forEach(element => {
      element.blendMode = 'screen';
      element.dashArray = [Math.random() * 256, 10];
    });
  }

  pointermove(x, y) {
    const delay = 0.006;
    this._elements.forEach((element, index) => {

      if (this._followPointer) {
        TweenLite.to(element.position, delay * index, { x, y });
      }
    });
  }

  shufflePoints() {
    this._elements.forEach(element => {
      if (element.segments) {
        element.segments.forEach(segment => {
          segment.point.x += (Math.random() * this._shuffleSize) - (this._shuffleSize / 2);
          segment.point.y += (Math.random() * this._shuffleSize) - (this._shuffleSize / 2);
        });
      }
    });

    this._svg.strokeColor = this._getStrokeColour();
  }

  /**
   * Export the current view as a SVG file.
   * @param {string} fileName
   */
  exportAsSVG(fileName = 'veczor_export.svg') {
    this._svg.strokeColor = EXPORT_COLOUR;
    const svg = this._svg.exportSVG({ asString: true });
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();

    this._svg.strokeColor = this._getStrokeColour();
  }

  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   */
  resize(canvasWidth, canvasHeight) {
    this._svg.position = this._engine.view.center;
  }

  _animate() {
    this._elements.forEach((element, index) => {
      // element.dashArray = [1000, 100 + (Math.tan(Math.sin(this.timer) * 100))];
      // element.dashArray = [100, Math.floor(Math.random() * 100)];
      element.dashOffset = (this.timer * 1000) / index;
      // element.rotation = (Math.sin((this.timer * 5)) * 0.01) * index;
    });
  }

  update() {
    if (this._autoTimer) {
      this.timer += 0.01;
    }

    this._animate();
  }

  _getStrokeColour() {
    // return 'white';
    return {
      gradient: {
        stops: ['#00fdff', '#4c21ef'],
      },
      origin: [0, this._engine.view.size.height],
      destination: [0, 0],
    };
  }

  /** @return {paper.Item} */
  get svg() {
    return this._svg;
  }

  get followPointer() {
    return this._followPointer;
  }

  set followPointer(follow) {
    this._followPointer = follow;

    if (!follow) {
      this._elements.forEach((element, index) => {
        TweenLite.to(element.position, 1, {
          x: element._storedPosition.x,
          y: element._storedPosition.y,
        });
      });
    }
  }

  get animate() {
    return this._autoTimer;
  }

  set animate(autoTimer) {
    this._autoTimer = autoTimer;
  }
}


export default Veczor;
