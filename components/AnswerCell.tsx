import {chakra, HStack, Stack, Text, useColorModeValue} from "@chakra-ui/react";
import {FC} from "react";

type AnswerCellProps = {
  text: string
}

const AnswerCell: FC<AnswerCellProps> = ({text}) => {
  const chatBgColor = useColorModeValue('#F7F7F8', 'bg4')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')

  return (
    <Stack bg={chatBgColor} border={'1px solid'} borderColor={'rgba(0,0,0,0.1)'} w={'full'} py={6} px={4} align={"center"}>
      <HStack maxW={['full', 'container.md']} w={'full'} h={'full'} spacing={6} align={"start"}>
        <Stack bg={'rgb(16, 163, 127)'} minW={'30px'} w={'30px'} h={'30px'} p={1} borderRadius={'2px'}>
          <chakra.img src={'/openai.svg'}/>
        </Stack>
        <Text color={fontColor} fontSize={'sm'} fontWeight={'500'} lineHeight={'30px'}>{text}</Text>
      </HStack>
    </Stack>
  )
}

export default AnswerCell