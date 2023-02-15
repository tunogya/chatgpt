import { defineStyleConfig } from '@chakra-ui/react'
import {Montserrat} from '@next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: 'md',
    fontFamily: montserrat.style.fontFamily,
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
      // @ts-ignore
      _hover: null,
      // @ts-ignore
      _active: null,
    },
    solid: {
      // @ts-ignore
      _hover: null,
      // @ts-ignore
      _active: null,
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