import Dialog from '../Dialog';
import { DialogIntroductionContext } from '../Dialog/provider';
import GUI from '../GUI';
import Grid from './Grid';

import style from './style.scss';

function DialogIntroduction() {
  return (
    <Dialog Context={DialogIntroductionContext}>
      <div class={style.Inner}>
        <h2 class={style.Title}>Presets</h2>
        <Grid class={style.grid}/>
        <GUI/>
      </div>
    </Dialog>
  );
}

export default DialogIntroduction;
