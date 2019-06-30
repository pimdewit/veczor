import style from './style.scss';


function GUI() {
  return (
    <details className={style.Config}>
      <summary>Config</summary>

      <label htmlFor="">
        Canvas Padding
        <input type="range" id="canvas-padding" value="200" min="1" max="1000" step="1"/>
        <output id="canvas-padding-output">200</output>
      </label>

      <label htmlFor="dash-length">
        Dash Length
        <input type="range" id="dash-length" value="100" min="1" max="1000" step="1"/>
        <output id="dash-length-output">100</output>
      </label>

      <label htmlFor="dash-gap">
        Dash Gap
        <input type="range" id="dash-gap" value="100" min="0" max="1000" step="1"/>
        <output id="dash-gap-output">100</output>
      </label>

      <label htmlFor="thickness">
        Thickness
        <input type="range" id="thickness" value="2" min="0.5" max="64" step="0.5"/>
        <output id="thickness-output">64</output>
      </label>

      <label htmlFor="follow-pointer">
        <div>
          <input type="checkbox" id="follow-pointer"/>
          Follow Pointer
        </div>
      </label>

      <label htmlFor="animate">
        <div>
          <input type="checkbox" id="animate" checked/>
          Animate
        </div>
      </label>

      <label htmlFor="blend-mode">
        Blending mode
        <select name="blend-mode" id="blend-mode">
          <option value="normal" selected>Normal</option>
          <option value="screen">Screen</option>
          <option value="multiply">Multiply</option>
          <option value="difference">Difference</option>
          <option value="color-burn">Color Burn</option>
          <option value="overlay">Overlay</option>
        </select>
      </label>

      <button type="button" id="random-color">Change colour</button>

      <button type="button" id="distort">Distort</button>

      <button type="button" id="export">Export to SVG</button>
    </details>
  );
}

export default GUI;
