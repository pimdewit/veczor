import Paper from 'paper';
import { TweenLite } from 'gsap/TweenLite';


/**
 * The default filename when attempting to download.
 * @type {string}
 * @see Veczor.exportToFile
 */
const DEFAULT_FILE_NAME = 'veczor_export.svg';

/**
 * Constants purely to prevent magic numbers.
 * @type {{LENGTH: number, GAP: number}}
 * @see Veczor.dashGap
 * @see Veczor.dashLength
 */
const DASH_ARRAY = {
  LENGTH: 0,
  GAP: 1,
};


/** A tool to create super-cool vector interactivity. */
class Veczor {
  /**
   * Load an SVG file.
   * @param {string} path - Path that leads to the SVG file to load.
   * @return {Promise<string>}
   */
  static async loadSVG(path) {
    const response = await fetch(path);
    const svgAsString = await response.text();

    if (svgAsString.includes('viewBox="')) {
      return Veczor.removeSVGViewBox(svgAsString);
    }

    return svgAsString;
  }

  /**
   * Remove the viewBox attribute from the svg in order to prevent the visuals from
   *   being cut off.The viewBox basically acts like a big compound path.
   * @param {SVGElement|string} svg - A string representation of an SVG file, or an
   *   actual SVGElement.
   * @return {SVGElement|string}
   */
  static removeSVGViewBox(svg) {
    if (typeof svg === 'string') {
      return svg.replace(/ viewBox=".*?"/g, '');
    }

    return svg;
  }

  /**
   * @param {paper.Item} svgElement - The parent <svg> element (imported in Paper).
   * @return {Array.<paper.Item>}
   */
  static getSVGChildElements(svgElement) {
    let paths = [];

    svgElement.children.forEach(group => {
      if (group.children) {
        paths = group.children;
      }
    });

    return paths;
  }

  /**
   * Find and return all Path elements from the SVG.
   * Path elements are significant because they contain "Vector2" coordinates unlike most other SVG
   * child elements.
   * @param {paper.PathItem|paper.Path|paper.CompoundPath|paper.Item} element
   * @private
   * @return {Array.<paper.Path>|Array}
   */
  static getPathsFromElement(element) {
    if (element.segments) {
      return [element];
    } else if (element.children) {
      return element.children.filter(child => child.segments);
    }

    return [];
  }

  /**
   * Create a gradient stroke.
   * @param {number} start - The Y position of where the gradient should start.
   * @param {number} end - The Y position of where the gradient should end.
   * @param {number} [startRange=0] - TODO:
   * @param {number} [endRange=360] - TODO:
   * @return {{gradient: {stops: string[]}, origin: *[], destination: number[]}}
   *
   * @example
   * Veczor.createNeonColor(0, window.innerHeight);
   */
  static createNeonColor(start, end, startRange = 0, endRange = 360) {
    const hue = startRange + Math.floor(Math.random() * endRange);
    const endHue = startRange + Math.floor(Math.random() * endRange);

    const startColor = `hsl(${hue}, 70%, 50%)`;
    const endColor = `hsl(${endHue}, 90%, 50%)`;

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
     * @type {Object}
     * @property {boolean} followPointer - Whether the elements should follow the position position.
     * @property {number} velocity - The velocity that powers the animations are powered.
     * @property {Object} position
     * @property {number} position.x - X position of the position.
     * @property {number} position.y - Y position of the position.
     * @property {Object} element
     * @property {string} element.blendMode - A blending mode that gets applied on the element.
     * @property {Array.<number>} element.dashArray - SVG dashArray.
     * @property {string} element.strokeCap - SVG strokeCap.
     * @property {string} element.strokeColor - SVG strokeColor.
     * @property {number} element.strokeWidth - SVG strokeWidth.
     * @property {number} element.positionStagger - A delay that gets applied with every
     *   iteration of the elements array (purely for visual effect).
     * @private
     */
    this._options = {
      followPointer: false,
      velocity: 0,
      position: {
        x: -1,
        y: -1,
      },
      element: {
        blendMode: 'normal',
        dashArray: [32, 960],
        strokeCap: 'round',
        strokeColor: '#f04',
        strokeWidth: 2,
        positionStagger: 0.006,
      },
    };

    /**
     * The stored velocity. We use this to check if we should re-render.
     * @type {number}
     * @private
     * @see Veczor.update
     */
    this._storedVelocity = this._options.velocity;

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
     * The supplied SVG file, imported in the Paper namespace.
     * @see Veczor.svg
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


  // Private methods

  /**
   * Setup the given SVG to match the Veczor aesthetic.
   * @param {SVGElement} svg
   * @private
   */
  _setupSVG(svg) {
    const { strokeCap, strokeColor, strokeWidth, blendMode } = this._options.element;

    this._svg = this._engine.project.importSVG(svg);
    this._elements = Veczor.getSVGChildElements(this._svg);

    this._svg.strokeCap = strokeCap;
    this._svg.strokeWidth = strokeWidth;
    this._svg.strokeColor = strokeColor;

    this._elements.forEach(element => element.blendMode = blendMode);

    this._setDashArray();
  }

  /**
   * @private
   */
  _animate() {
    const dashVelocity = this._options.velocity * 1000;

    this._elements.forEach((element, index) => element.dashOffset = dashVelocity / (index + 1));
  }

  /**
   * Distort a path by taking its segments, and moving all "Vector2" points around.
   * @param {paper.Path|paper.CompoundPath|paper.Item} path
   * @param {number} amount - The maximum distortion amplitude in pixels.
   * @private
   */
  _distortPath(path, amount) {
    path.segments.forEach(segment => {
      segment.point.x += (Math.random() * amount) - (amount / 2);
      segment.point.y += (Math.random() * amount) - (amount / 2);
    });
  }

  /**
   * Interpolate the individual element positions to the given coordinates.
   * This method is here purely for visual/stylistic purposes.
   * @param {number} x
   * @param {number} y
   * @private
   */
  _tweenElementPositions(x, y) {
    const { positionStagger } = this._options.element;

    this._elements.forEach((element, index) => {
      TweenLite.to(element.position, positionStagger * index, { x, y });
    });
  }

  /**
   * This method is purely there to fix a bug in which the DashArray does not update unless you
   * trigger the DashOffset too.
   * @private
   * @see Veczor.dashLength
   * @see Veczor.dashGap
   */
  _setDashArray() {
    this._svg.dashArray = this._options.element.dashArray;
    this._elements.forEach(element => element.dashOffset += 0.0001);
  }


  // Public API

  /** Main update method. Hook this up to your own animation loop! */
  update() {
    if (this.velocity === this._storedVelocity) {
      // Return if the velocity has not changed since the last frame.
      return;
    }

    this._animate();

    this._storedVelocity = this.velocity;
  }

  /**
   * Scale the SVG to match the canvas size.
   *
   * @example Common scenario
   *   const {width, height} = canvas;
   *   const padding = width > height ? height / 8 : width / 8;
   *   Veczor.fit(padding);
   *
   * @param {number} [padding=0] - Whitespace between the edge of the canvas and the SVG in pixels.
   */
  fit(padding = 0) {
    const { width, height } = this._engine.view.bounds;

    const x = padding;
    const y = padding;

    const boundsWidth = width - (padding * 2);
    const boundsHeight = height - (padding * 2);

    const bounds = new this._engine.Rectangle(x, y, boundsWidth, boundsHeight);

    this._svg.fitBounds(bounds);
  }

  /**
   * Center the main SVG element to the center of the view.
   *
   * @example Common scenario
   *   window.addEventListener('resize', MyVeczorInstance.center());
   */
  center() {
    this._svg.position = this._engine.view.center;
  }

  /**
   * Shuffle all vector `Vector2D` points around (positional).
   *
   * @param {number} amount - The maximum distortion amplitude in pixels.
   * @see Veczor._distortPath
   */
  distort(amount) {
    this._elements.forEach(element => {
      const pathsToDistort = Veczor.getPathsFromElement(element);
      pathsToDistort.forEach(path => this._distortPath(path, amount));
    });
  }

  /**
   * Export the current view as a SVG file.
   * Calling this will open the OS' file-system downloads prompt.
   * @param {string} fileName
   */
  exportToFile(fileName = DEFAULT_FILE_NAME) {
    const svg = /** @type {string} */ (this._svg.exportSVG({ asString: true }));
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
  }


  // Configuration

  /**
   * The current velocity.
   * @return {number}
   */
  get velocity() {
    return this._options.velocity;
  }

  /**
   * Adjust the velocity.
   * @param {number} velocity
   */
  set velocity(velocity) {
    TweenLite.to(this._options, 2, { velocity });
  }


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
    const { x, y } = followPointer ? this._options.position : this._engine.view.center;

    this._options.followPointer = followPointer;

    this._tweenElementPositions(x, y);
  }


  /**
   * Get the position of the SVG.
   * @return {{x: number, y: number}}
   */
  get position() {
    return this._options.position;
  }

  /**
   * @param {Object} param
   * @property {number} param.x - Position of the SVG on the X axis.
   * @property {number} param.y - Position of the SVG on the Y axis.
   */
  set position({ x, y }) {
    this._options.position.x = x;
    this._options.position.y = y;

    if (this._options.followPointer) {
      this._tweenElementPositions(x, y);
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
   * Returns the currently rendered colour.
   * @return {string|paper.Color}
   */
  get color() {
    return this._options.element.color;
  }

  /**
   * Set the colour of the subject.
   * @param {string|paper.Color} color
   * @see Veczor.createNeonColor
   */
  set color(color) {
    this._options.element.strokeColor = color;
    this._svg.strokeColor = color;
  }


  /**
   * Returns the current dash gap.
   * @return {number}
   */
  get dashGap() {
    return this._options.element.dashArray[DASH_ARRAY.GAP];
  }

  /**
   * Set a dash gap on the svg elements.
   * @param {number} dashGap
   */
  set dashGap(dashGap) {
    this._options.element.dashArray[DASH_ARRAY.GAP] = dashGap;
    this._setDashArray();
  }


  /**
   * Returns the current dash gap.
   * @return {number}
   */
  get dashLength() {
    return this._options.element.dashArray[DASH_ARRAY.LENGTH];
  }

  /**
   * Set a dash gap on the svg elements.
   * @param {number} dashLength
   */
  set dashLength(dashLength) {
    this._options.element.dashArray[DASH_ARRAY.LENGTH] = dashLength;
    this._setDashArray();
  }


  /**
   * Returns the currently rendered stroke width.
   * @return {number}
   */
  get strokeWidth() {
    return this._options.element.strokeWidth;
  }

  /**
   * Set the stroke width of the svg elements.
   * @param {number} strokeWidth
   */
  set strokeWidth(strokeWidth) {
    this._options.element.strokeWidth = strokeWidth;

    this._svg.strokeWidth = strokeWidth;
  }


  /**
   * Returns the active blending mode.
   * @return {string}
   */
  get blendMode() {
    return this._options.element.blendMode;
  }

  /**
   * Apply a blending mode to the svg.
   * @param {paper.Item.blendMode|string} blendMode
   * @see {@link http://paperjs.org/reference/item/#blendmode}
   */
  set blendMode(blendMode) {
    this._options.element.blendMode = blendMode;

    this._elements.forEach(element => element.blendMode = blendMode);
  }
}


export default Veczor;
