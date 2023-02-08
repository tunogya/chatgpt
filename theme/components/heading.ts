import {defineStyleConfig} from "@chakra-ui/react";
import {Montserrat} from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const Heading = defineStyleConfig({
  baseStyle: {
    fontFamily: `${montserrat.style.fontFamily}`,
  }
})

export default Heading