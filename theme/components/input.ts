import { defineStyleConfig } from '@chakra-ui/react'
import {Montserrat} from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const Input = defineStyleConfig({
  baseStyle: {},
  variants: {
    filled: {
      field: {
        fontFamily: montserrat.style.fontFamily,
        borderRadius: '6px',
        height: '40px',
        borderWidth: '2px',
        fontSize: 'md',
        fontWeight: '600',
        _focus: {
        },
        _hover: {
        },
      },
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'filled',
  }
})

export default Input