import { Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { DialogIntroductionContext, DialogIntroductionProvider } from '../Dialog/provider';
import DialogIntroduction from '../DialogIntroduction';

import Information from '../Information';
import style from './style.scss';


function Shell() {
  const introduction = useContext(DialogIntroductionContext);

  return (
    <Fragment>
      <main class={style.Main} inert={introduction.open}>
        <Information class={style.Information} inert={introduction.open}/>
      </main>

      <canvas id="canvas" class={style.Veczor} data-paper-resize="true"
              data-alt-background={introduction.open}/>
      <DialogIntroduction/>
    </Fragment>
  );
}

function App() {
  return (
    <DialogIntroductionProvider>
      <Shell/>
    </DialogIntroductionProvider>
  );
}

export default App;
