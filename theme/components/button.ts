import { defineStyleConfig } from '@chakra-ui/react'
import {Montserrat} from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '0.375rem',
    fontFamily: montserrat.style.fontFamily,
    cursor: 'pointer',
  },
  sizes: {
    md: {
      fontSize: 'sm',
      fontWeight: '500',
      height: '44px',
    },
  },
  variants: {
    outline: {
      border: '1px solid',
      _hover: {
        bg: "none",
      },
      _active: {
        bg: "none",
      }
    },
    solid: {
    },
    ghost: {
      px: 3,
      _hover: {
        bg: "none",
        opacity: 0.8,
      },
      _active: {
        bg: "none",
        opacity: 0.9,
      }
    }
  },
  defaultProps: {
    size: 'md',
  }
})

export default Button