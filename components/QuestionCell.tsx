import {Avatar, HStack, Stack, Text, useColorModeValue} from "@chakra-ui/react";
import {FC} from "react";

type QuestionCellProps = {
  name: string
  text: string
}

const QuestionCell: FC<QuestionCellProps> = ({name, text}) => {
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')

  return (
    <Stack w={'full'} py={6} px={4} align={"center"}>
      <HStack maxW={['full', 'container.md']} w={'full'} h={'full'} spacing={6} align={"start"}>
        <Avatar borderRadius={'2px'} minW={'30px'} w={'30px'} h={'30px'} iconLabel={'icon'} size={'md'} name={name}
                textTransform={'none'} bg={'bg5'}/>
        <Text color={fontColor} fontSize={'sm'} fontWeight={'500'}>{text}</Text>
      </HStack>
    </Stack>
  )
}

export default QuestionCell