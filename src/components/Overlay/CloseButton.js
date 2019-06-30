import style from './CloseButton.scss';


function CloseButton({ toggle }) {
  return (
    <button onClick={toggle} className={style.CloseButton}>
      <span className="a11y-visually-hidden">Close</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill="currentColor"
              d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z"/>
      </svg>
    </button>
  );
}

export default CloseButton;
