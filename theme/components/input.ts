import { defineStyleConfig } from '@chakra-ui/react'
import {Montserrat} from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const Input = defineStyleConfig({
  baseStyle: {},
  sizes: {
    sm: {
      field: {
        height: '40px',
      }
    },
    md: {
      field: {
        height: '44px',
      }
    },
    lg: {
      field: {
        height: '50px',
      }
    }
  },
  variants: {
    filled: {
      field: {
        fontFamily: montserrat.style.fontFamily,
        borderRadius: '6px',
        borderWidth: '1px',
        fontSize: 'md',
        fontWeight: '600',
        _focus: {
        },
        _hover: {
        },
      },
    },
    outline: {
      field: {
        fontFamily: montserrat.style.fontFamily,
        borderRadius: '6px',
        borderWidth: '1px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        fontSize: 'md',
        fontWeight: '600',
        _focus: {
        },
        _hover: {
        },
      }
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'filled',
  }
})

export default Input