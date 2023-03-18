import { defineStyleConfig } from '@chakra-ui/react'

const Input = defineStyleConfig({
  baseStyle: {},
  variants: {
    filled: {
      field: {
        fontFamily: "Söhne",
        borderRadius: '6px',
        borderWidth: '1px',
        fontSize: 'sm',
        fontWeight: '500',
        _focus: {
        },
        _hover: {
        },
      },
    },
    outline: {
      field: {
        fontFamily: "Söhne",
        borderRadius: '6px',
        borderWidth: '1px',
        fontSize: 'sm',
        fontWeight: '500',
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