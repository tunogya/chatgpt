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
  colors: {
    bg1: '#202123', // menu bg
    bg3: '#2A2B32', // button hover bg
    bg2: '#343541', // content bg
    bg4: '#444654',
    bg5: '#7B8F9A',
    fontColor1: '#343541', // light font
    fontColor2: '#ECECF1', // dark font
    fontColor3: 'gray.500', // secondary font
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