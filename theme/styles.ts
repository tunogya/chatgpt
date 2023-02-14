const styles = {
  global: {
    // styles for the `body`
    body: {
      bg: 'gray.50',
      color: 'gray.800',
      scroll: 'no',
      overflowY: 'hidden',
    },
    '*': {
      '-webkit-overflow-scrolling': 'touch',
      '-ms-overflow-style': 'none'
    },
    'div,a,img': {
      '-webkit-tap-highlight-color': 'transparent',
      '-webkit-touch-callout': 'none',
    },
  }

}

export default styles