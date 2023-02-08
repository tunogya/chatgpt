import { extendTheme } from '@chakra-ui/react'
import styles from './styles'
import Button from './components/button'
import Text from './components/text'
import Heading from "./components/heading";
import Input from "./components/input";


const overrides = {
  styles,
  components: {
    Button,
    Text,
    Heading,
    Input,
  },
}

export default extendTheme(overrides)