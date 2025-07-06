export const styles = {
  switch: {
    fontSize: '17px',
    position: 'relative',
    display: 'inline-block',
    width: '4em',
    height: '2.2em',
    borderRadius: '30px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  input: {
    opacity: '0',
    width: '0',
    height: '0',
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: '#2a2a2a',
    transition: '0.4s',
    borderRadius: '30px',
    overflow: 'hidden',
  },
  sliderBefore: {
    position: 'absolute',
    content: '""',
    height: '1.2em',
    width: '1.2em',
    borderRadius: '20px',
    left: '0.5em',
    bottom: '0.5em',
    transition: '0.4s',
    transitionTimingFunction: 'cubic-bezier(0.81, -0.04, 0.38, 1.5)',
    boxShadow: 'inset 8px -4px 0px 0px #fff',
  },
  sliderChecked: {
    backgroundColor: '#00a6ff',
  },
  sliderBeforeChecked: {
    transform: 'translateX(1.8em)',
    boxShadow: 'inset 15px -4px 0px 15px #ffcf48',
  },
  star: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    width: '5px',
    transition: 'all 0.4s',
    height: '5px',
  },
  star1: {
    left: '2.5em',
    top: '0.5em',
  },
  star2: {
    left: '2.2em',
    top: '1.2em',
  },
  star3: {
    left: '3em',
    top: '0.9em',
  },
  starHidden: {
    opacity: '0',
  },
  cloud: {
    width: '3.5em',
    position: 'absolute',
    bottom: '-1.4em',
    left: '-1.1em',
    opacity: '0',
    transition: 'all 0.4s',
  },
  cloudVisible: {
    opacity: '1',
  },
  container: {
    padding: '20px',
  },
};