import { extendTheme } from '@chakra-ui/react'
import styles from './styles'
import Button from './components/button'
import Text from './components/text'
import Heading from "./components/heading";
import Input from "./components/input";
import {Montserrat} from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const overrides = {
  initialColorMode: 'light',
  useSystemColorMode: true,
  fonts: {
    body: montserrat.style.fontFamily,
    heading: montserrat.style.fontFamily,
    mono: montserrat.style.fontFamily,
  },
  styles,
  components: {
    Button,
    Text,
    Heading,
    Input,
  },
}

export default extendTheme(overrides)