import { createContext } from 'preact';
import { OverlayBase } from '../Overlay';


export const DialogHelpContext = createContext('help');
export const DialogIntroductionContext = createContext('introduction');


export class DialogHelpProvider extends OverlayBase {
  render(props, state) {
    return (
      <DialogHelpContext.Provider value={state}>
        {props.children}
      </DialogHelpContext.Provider>
    );
  }
}


export class DialogIntroductionProvider extends OverlayBase {
  _onMount = () => {};

  _onKeyDown = (keyCode, shiftKey) => {
    if (keyCode === 191 && shiftKey) this.setState({ open: !this.state.open });
  };

  render(props, state) {
    return (
      <DialogIntroductionContext.Provider value={state}>
        {props.children}
      </DialogIntroductionContext.Provider>
    );
  }
}
