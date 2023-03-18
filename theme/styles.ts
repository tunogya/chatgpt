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
    '::-webkit-scrollbar': {
      width: '0px',
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-button': {
      display: 'none',
    },
    '::-webkit-scrollbar-corner': {
      background: 'transparent',
    }
  }

}

export default styles