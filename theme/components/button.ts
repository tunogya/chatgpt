import { defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: 'md',
    fontFamily: "Söhne",
    cursor: 'pointer',
  },
  sizes: {
    md: {
      fontSize: 'sm',
      fontWeight: '500',
      height: '44px',
    },
    lg: {
      fontSize: 'sm',
      fontWeight: '500',
      height: '48px',
    }
  },
  variants: {
    outline: {
      border: '1px solid',
      _hover: {
        bg: '',
        opacity: 0.8,
      },
      _active: {
        bg: '',
        opacity: 0.8,
      },
    },
    solid: {
      _hover: {
        bg: '',
        opacity: 0.8,
      },
      _active: {
        bg: '',
        opacity: 0.8,
      },
    },
    ghost: {
      px: 3,
      _hover: {
        bg: 'none',
        opacity: 0.8,
      },
      _active: {
        bg: 'none',
        opacity: 0.9,
      }
    }
  },
  defaultProps: {
    size: 'md',
  }
})

export default Button