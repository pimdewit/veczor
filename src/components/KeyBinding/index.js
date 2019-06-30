import style from './style.scss';


function KeyBinding(props) {
  if (props.onClick) {
    return (
      <button role="button" className={style.KeyBinding} {...props} data-no-focus-style>
        <kbd className={style.Key}>
          {props.children}
        </kbd>
      </button>
    );
  } else {
    return (
      <div className={style.KeyBinding} {...props}>
        <kbd className={style.Key}>
          {props.children}
        </kbd>
      </div>
    );
  }
}

export default KeyBinding;
