import { defineStyleConfig } from '@chakra-ui/react'
import {Montserrat} from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '6px',
    fontFamily: montserrat.style.fontFamily,
    cursor: 'pointer',
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
      color: 'white',
    },
    ghost: {
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
})

export default Button