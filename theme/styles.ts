const styles = {
  global: {
    "#root": {
      display: 'flex',
      flexDirection: 'column',
    },
    body: {
      bg: 'gray.50',
      color: 'gray.800',
      overflow: 'auto',
      '-webkit-overflow-scrolling': 'touch',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      '::-webkit-scrollbar': {
        display: 'none',
      },
    },
    '*': {
      '-ms-overflow-style': 'none'
    },
    'div,a,img': {
      '-webkit-tap-highlight-color': 'transparent',
    },
  }

}

export default styles