import style from './Grid.scss';

function Grid(props) {
  return (
    <section {...props}>
      <div className={style.Tile}>
        <button role="button" data-preset="vivaPinata" data-no-focus-style>Viva Piñata</button>
      </div>
      <div class={style.Tile}>
        <button role="button" data-preset="cartography" data-no-focus-style>Cartography</button>
      </div>
      <div class={style.Tile}>
        <button role="button" data-preset="fireworks" data-no-focus-style>Fireworks</button>
      </div>
      <div className={style.Tile}>
        <button role="button" data-preset="vaporwave" data-no-focus-style>VaporWave</button>
      </div>
      <div className={style.Tile}>
        <button role="button" data-preset="mehndi" data-no-focus-style>Mehndi</button>
      </div>
      <p>More coming soon</p>
    </section>
  );
}

export default Grid;
