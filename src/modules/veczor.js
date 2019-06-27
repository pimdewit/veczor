import Paper from 'paper';
import { TweenLite } from 'gsap/TweenLite';


const DEFAULT_FILE_NAME = 'vezcor.web.app_export.svg';


/** Visual experiment. */
class Veczor {
  /**
   * Load an SVG file.
   * @async
   * @static
   * @param {string} path - Path that leads to the SVG file to load.
   * @return {Promise<string>}
   */
  static async loadSVG(path) {
    const response = await fetch(path);
    return await response.text();
  }

  /**
   * @param {paper.Item} svgElement - The parent <svg> element (imported in Paper).
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
   * Create a gradient stroke.
   * @param {number} start - The Y position of where the gradient should start.
   * @param {number} end - The Y position of where the gradient should end.
   * @return {{gradient: {stops: string[]}, origin: *[], destination: number[]}}
   */
  static createNeonColor(start, end) {
    const hue = Math.floor(Math.random() * 360);
    const endHue = hue + Math.floor(Math.random() * 160);

    const startColor = `hsl(${hue}, 100%, 50%)`;
    const endColor = `hsl(${endHue}, 100%, 50%)`;

    return {
      gradient: {
        stops: [startColor, endColor],
      },
      origin: [start, end],
      destination: [0, 0],
    };
  }

  /**
   * @param {HTMLCanvasElement} canvas - Canvas to draw to.
   * @param {SVGElement|string} svg - A string representation of an SVG file, or an
   *   actual SVGElement.
   */
  constructor(canvas, svg) {
    /**
     *
     * @type {Object}
     * @property {boolean} idleEnergy - Whether the instance is animating without user interaction.
     * @property {number} distortionIntensity - The intensity of a distortion call.
     * @property {boolean} followPointer - Whether the elements should follow the position position.
     * @property {Object} position
     * @property {number} position.x - X position of the position.
     * @property {number} position.y - Y position of the position.
     * @property {Object} element
     * @property {string} element.blendMode - A blending mode that gets applied on the element.
     * @property {Array.<number>} element.dashArray - SVG dashArray.
     * @property {string} element.strokeCap - SVG strokeCap.
     * @property {string} element.strokeColor - SVG strokeColor.
     * @property {number} element.strokeWidth - SVG strokeWidth.
     * @property {number} element.pointerIterationDelay - A delay that gets applied with every
     *   iteration of the elements array (purely for visual effect).
     * @private
     */
    this._options = {
      distortionIntensity: 100,
      followPointer: false,
      position: {
        x: -1,
        y: -1,
      },
      element: {
        blendMode: 'screen',
        dashArray: [100, 10],
        strokeCap: 'round',
        strokeColor: 'white',
        strokeWidth: 2,
        pointerIterationDelay: 0.006,
      },
    };

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

    /**
     * A number on which animations depend.
     * @type {number}
     * @see {Veczor._animate}
     */
    this.velocity = 0;

    /**
     * The supplied SVG file, imported in the Paper namespace.
     * @see {Veczor.svg}
     * @see {@link http://paperjs.org/reference/project/#importsvg-svg}
     * @type {?paper.Item}
     * @private
     */
    this._svg = null;

    /**
     * An array containing all child "nodes" from the supplied SVG file.
     * @type {?Array<paper.Item>}
     * @private
     */
    this._elements = null;

    this._engine.setup(canvas);

    this._setupSVG(svg);
  }


  // Application

  /**
   * Setup the given SVG to match the Veczor aesthetic.
   * @param {SVGElement} svg
   * @private
   */
  _setupSVG(svg) {
    const { strokeCap, strokeColor, strokeWidth, blendMode, dashArray } = this._options.element;

    this._svg = this._engine.project.importSVG(svg);

    this._svg.scale(3);

    this._elements = Veczor.getSVGChildElements(this._svg);

    this._svg.strokeCap = strokeCap;
    this._svg.strokeWidth = strokeWidth;
    this._svg.strokeColor = strokeColor;

    this._elements.forEach(element => {
      // element.strokeColor = '#'+Math.floor(Math.random()*16777215).toString(16);
      element.blendMode = blendMode;
      element.dashArray = dashArray; // [Math.random() * 256, 190];
    });
  }

  /**
   * Main animation logic
   * @private
   */
  _animate() {
    this._elements.forEach((element, index) => {
      // element.dashArray = [1000, 100 + (Math.tan(Math.sin(this.velocity) * 100))];
      // element.dashArray = [100, Math.floor(Math.random() * 100)];
      element.dashOffset = (this.velocity * 1000) / index;
      // element.rotation = (Math.sin((this.velocity * 5)) * 0.01) * index;
    });
  }


  // Public API

  /** Main update method. Hook this up to your own animation loop! */
  update() {
    this._animate();
  }

  /** Center the main SVG element to the center of the view. */
  center() {
    this._svg.position = this._engine.view.center;
  }

  /** Shuffle all vector `Vector2D` points around (positional). */
  distort() {
    const { distortionIntensity } = this._options;

    this._elements.forEach(element => {
      if (element.segments) {
        element.segments.forEach(segment => {
          segment.point.x += (Math.random() * distortionIntensity) - (distortionIntensity / 2);
          segment.point.y += (Math.random() * distortionIntensity) - (distortionIntensity / 2);
        });
      }
    });
  }

  /**
   * Export the current view as a SVG file.
   * @param {string} fileName
   */
  exportToFile(fileName = DEFAULT_FILE_NAME) {
    const svg = this._svg.exportSVG({ asString: true });
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
  }


  // Configuration

  /**
   * Gets whether the elements are following the position.
   * @return {boolean}
   */
  get followPointer() {
    return this._options.followPointer;
  }

  /**
   * Set's the position follow.
   * @param {boolean} followPointer
   */
  set followPointer(followPointer) {
    this._options.followPointer = followPointer;

    if (!followPointer) {
      this._elements.forEach((element, index) => {
        TweenLite.to(element.position, 1, {
          x: (this._canvas.width / 2) + (element._storedPosition.x / 2),
          y: (this._canvas.height / 2) + (element._storedPosition.y / 2),
        });
      });
    }
  }


  /**
   * @param {Object} param
   * @property {number} param.x - Position of the SVG on the X axis.
   * @property {number} param.y - Position of the SVG on the Y axis.
   */
  set position({ x, y }) {
    const { pointerIterationDelay } = this._options.element;

    if (this._options.followPointer) {
      this._elements.forEach((element, index) => {
        TweenLite.to(element.position, pointerIterationDelay * index, { x, y });
      });
    }
  }


  /** @return {paper.Item} */
  get svg() {
    return this._svg;
  }

  /**
   *
   * @param {SVGElement|string|paper.Item} svg - A string representation of an SVG file, or an
   *   actual SVGElement.
   */
  set svg(svg) {
    if (this._svg) {
      this._svg.remove();
    }

    this._setupSVG(svg);
  }


  /**
   * Set the colour of the subject.
   * @param {string|object} color
   * @see {@link https://stackoverflow.com/questions/21216417/paperjs-stroke-with-gradient}
   */
  set color(color) {
    this._options.element.strokeColor = color;
    this._svg.strokeColor = color;
  }

}


export default Veczor;
