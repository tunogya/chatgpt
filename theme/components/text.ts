import {defineStyleConfig} from "@chakra-ui/react";
import {Montserrat, } from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });


const Text = defineStyleConfig({
  baseStyle: {
    color: 'gray.800',
    fontFamily: montserrat.style.fontFamily,
  }
})

export default Text