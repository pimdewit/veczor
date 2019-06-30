import { Component } from 'preact';
import { useContext } from 'preact/hooks';

import CloseButton from './CloseButton';


export function Overlay(props) {
  const { Context, children, wrapperClass = '', elementClass = '', hasBackdrop = false } = props;

  const { open, toggle } = useContext(Context);
  if (open && this.element) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.element.focus();
    }));
  }

  return (
    <div inert={!open} class={wrapperClass} {...props}
         onClick={({ srcElement }) => this.wrapper === srcElement ? toggle() : null}
         ref={element => this.wrapper = element}>

      {hasBackdrop && <div onClick={toggle}/>}
      <section tabIndex="-1" class={elementClass} ref={element => this.element = element}>
        <CloseButton toggle={toggle}/>
        {children}
      </section>
    </div>
  );
}


export class OverlayBase extends Component {
  constructor(props) {
    super(props);

    this.activeElement = document.body;

    this.toggle = () => this.setState({ open: !this.state.open });

    this.state = {
      open: false,
      toggle: this.toggle,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.__onKeyDown);
    this._onMount();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.__onKeyDown);
    this._onDismount();
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (!this.state.open && nextState.open) {
      this.activeElement = document.activeElement;
    } else if (this.state.open && !nextState.open) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        this.activeElement.focus();
      }));
    }
  }

  __onKeyDown = ({ keyCode, shiftKey }) => {
    if (keyCode === 27 && this.state.open) {
      this.setState({ open: false });
    }

    this._onKeyDown(keyCode, shiftKey);
  };

  // For inheritance.
  _onMount = () => {
  };
  _onDismount = () => {
  };
  _onKeyDown = () => {
  };
}
