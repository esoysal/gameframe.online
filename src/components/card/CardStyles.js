

const Card = {
  main: {
    padding: '10px 10px 10px 10px',
    width: '256px',
    WebkitTransform: 'translateZ(0)',
    MozTransform: 'translateZ(0)',
    MsTransform: 'translateZ(0)',
    OTransform: 'translateZ(0)',
    transform: 'translateZ(0)',
    willChange: 'transform',
  },

  card: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: '10px',
    backgroundColor: 'darkgray',
    WebkitTransition: '-webkit-transform 0.2s, -webkit-filter 0.3s ease',
    MozTransition: '-moz-transform 0.2s, -moz-filter 0.3s ease',
    MsTransition: '-ms-transform 0.2s, -ms-filter 0.3s ease',
    OTransition: '-o-transform 0.2s, -o-filter 0.3s ease',
    transition: 'transform 0.2s, filter 0.3s ease',
    WebkitTransform: 'scale(1.0)',
    MozTransform: 'scale(1.0)',
    MsTransform: 'scale(1.0)',
    OTransform: 'scale(1.0)',
    transform: 'scale(1.0)',
    ':hover': {
      WebkitTransition: '-webkit-transform 0.2s, -webkit-filter 0.5s ease',
      MozTransition: '-moz-transform 0.2s, -moz-filter 0.5s ease',
      MsTransition: '-ms-transform 0.2s, -ms-filter 0.5s ease',
      OTransition: '-o-transform 0.2s, -o-filter 0.5s ease',
      transition: 'transform 0.2s, filter 0.5s ease',
      WebkitTransform: 'scale(0.98)',
      MozTransform: 'scale(0.98)',
      MsTransform: 'scale(0.98)',
      OTransform: 'scale(0.98)',
      transform: 'scale(0.98)',
      WebkitFilter: 'hue-rotate(360deg)',
      MozFilter: 'hue-rotate(360deg)',
      MsFilter: 'hue-rotate(360deg)',
      OFilter: 'hue-rotate(360deg)',
      filter: 'hue-rotate(360deg)',
    },

    titleText: {
      color: '#e9e9e9',
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },

    clicked: {
      WebkitFilter: 'brightness(0.5) hue-rotate(360deg)',
      MozFilter: 'brightness(0.5) hue-rotate(360deg)',
      MsFilter: 'brightness(0.5) hue-rotate(360deg)',
      OFilter: 'brightness(0.5) hue-rotate(360deg)',
      filter: 'brightness(0.5) hue-rotate(360deg)',
    },
  },

  tooltip: {
    display: 'flex',
    position: 'fixed',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    top: '0',
    overflow: 'scroll',
    left: '0',
    padding: '5% 5% 0px 5%',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    WebkitTransition: 'opacity 0.25s ease-out',
    MozTransition: 'opacity 0.25s ease-out',
    MsTransition: 'opacity 0.25s ease-out',
    OTransition: 'opacity 0.25s ease-out',
    transition: 'opacity 0.25s ease-out',
    opacity: '0.0',
    ':hover': {
      zIndex: '100',
      height: '100%',
      opacity: '1.0',
      color: 'white',
      WebkitTransition: 'opacity 0.125s ease-in',
      MozTransition: 'opacity 0.125s ease-in',
      MsTransition: 'opacity 0.125s ease-in',
      OTransition: 'opacity 0.125s ease-in',
      transition: 'opacity 0.125s ease-in',
      textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black, -1px 0 0 black, 1px 0 0 black, 0 1px 0 black, 0 -1px 0 black, 0 0 2px black',
    },
  },
  imageContainerContainer: {
    backgroundColor: 'darkGray',
    height: '256px',
    ':hover': {
      backgroundColor: 'darkGray',
    },
  },

  imageContainer: () => ({
    overflow: 'hidden',
    borderRadius: '10px',
    WebkitTransition: '-webkit-transform 0.2s',
    MozTransition: '-moz-transform 0.2s',
    MsTransition: '-ms-transform 0.2s',
    OTransition: '-o-transform 0.2s',
    transition: 'transform 0.2s',
    WebkitTransform: 'scale(0.995)',
    MozTransform: 'scale(0.995)',
    MsTransform: 'scale(0.995)',
    OTransform: 'scale(0.995)',
    transform: 'scale(0.995)',
    objectFit: 'fill',
    margin: 'auto',
    display: 'flex',
    verticalAlign: 'middle',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: '100% 100%',
    ':hover': {
      WebkitTransform: 'scale(1.0)',
      MozTransform: 'scale(1.0)',
      MsTransform: 'scale(1.0)',
      OTransform: 'scale(1.0)',
      transform: 'scale(1.0)',
      backgroundColor: 'darkgray',
    },
  }),

  backgroundImage: {
    position: 'fixed',
    WebkitFilter: 'blur(64px)',
    MozFilter: 'blur(64px)',
    OFilter: 'blur(64px)',
    MsFilter: 'blur(64px)',
    filter: 'blur(64px)',
    top: '-50%',
    left: '-50%',
    backgroundColor: 'white',
    margin: 'auto',
    width: '200%',
    height: '200%',
    zIndex: '1',
  },

  image: {
    maxWidth: '100%',
    borderRadius: '0px',
    WebkitTransition: '-webkit-transform 0.2s, -webkit-filter 0.2s',
    MozTransition: '-moz-transform 0.2s, -moz-filter 0.2s',
    MsTransition: '-ms-transform 0.2s, -ms-filter 0.2s',
    OTransition: '-o-transform 0.2s, -o-filter 0.2s',
    transition: 'transform 0.2s, filter 0.2s',
    WebkitTransform: 'scale(1.0)',
    MozTransform: 'scale(1.0)',
    MsTransform: 'scale(1.0)',
    OTransform: 'scale(1.0)',
    transform: 'scale(1.0)',
    margin: 'auto',
    verticalAlign: 'middle',
    zIndex: '2',
    ':hover': {
      WebkitTransition: '-webkit-transform 1.0s, -webkit-filter 1.0s',
      MozTransition: '-moz-transform 1.0s, -moz-filter 1.0s',
      MsTransition: '-ms-transform 1.0s, -ms-filter 1.0s',
      OTransition: '-o-transform 1.0s, -o-filter 1.0s',
      transition: 'transform 1.0s, filter 1.0s',
      WebkitTransform: 'scale(1.05)',
      MozTransform: 'scale(1.05)',
      MsTransform: 'scale(1.05)',
      OTransform: 'scale(1.05)',
      transform: 'scale(1.05)',
    },
  },


  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: '2% 5% 2% 0%',
    WebkitTransition: 'height 0.2s',
    MozTransition: 'height 0.2s',
    MsTransition: 'height 0.2s',
    OTransition: 'height 0.2s',
    transition: 'height 0.2s',
  },

  caption: {
    maxWidth: '65%',
    postion: 'relative',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  badgeContainer: {
    maxWidth: '35%',
  },
};

export default Card;
