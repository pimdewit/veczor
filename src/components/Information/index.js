import { useContext } from 'preact/hooks';

import KeyBinding from '../KeyBinding';

import { DialogIntroductionContext } from '../Dialog/provider';


function Information(props) {
  const { toggle } = useContext(DialogIntroductionContext);
  return (
    <section {...props}>
      <KeyBinding onClick={toggle} aria-label="Open the introduction modal.">
        <span>SHIFT</span> + <span>/</span>
      </KeyBinding>

      <h1 className="copyright">Veczor, an experiment by <a href="https://pdw.io">Pim</a></h1>
    </section>
  );
}

export default Information;
