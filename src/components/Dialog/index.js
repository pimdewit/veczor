import { Overlay } from '../Overlay';
import style from './style.scss';


function Dialog(props) {
  const {Context, children} = props;
  return (
    <Overlay Context={Context} wrapperClass={style.Wrapper} elementClass={style.Dialog} {...props}>
      {children}
    </Overlay>
  );
}

export default Dialog;
