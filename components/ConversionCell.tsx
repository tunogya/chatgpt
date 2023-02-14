import {Avatar, chakra, HStack, Stack, Text, useColorModeValue} from '@chakra-ui/react';
import {FC} from 'react';

export type ConversionCellProps = {
  name: string,
  text: string
}

const ConversionCell: FC<ConversionCellProps> = ({name, text}) => {
  const chatBgColor = useColorModeValue('#F7F7F8', 'bg4')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')

  return (
    <Stack bg={name === 'chatgpt' ? chatBgColor : ''} border={name === 'chatgpt' ? '1px solid' : 'none'} borderColor={'rgba(0,0,0,0.1)'} w={'full'}
           py={6} px={4} align={'center'}>
      <HStack maxW={['full', 'container.md']} w={'full'} h={'full'} spacing={6} align={'start'}>
        {name === 'chatgpt' ? (
          <Stack bg={'rgb(16, 163, 127)'} minW={'30px'} w={'30px'} h={'30px'} p={1} borderRadius={'2px'}>
            <chakra.img src={'/openai.svg'}/>
          </Stack>
        ) : (
          <Avatar borderRadius={'2px'} minW={'30px'} w={'30px'} h={'30px'} iconLabel={'icon'} size={'md'} name={name}
                  textTransform={'none'} bg={'bg5'}/>
        )}
        <Text color={fontColor} fontSize={'md'} fontWeight={'500'}>{text}</Text>
      </HStack>
    </Stack>
  )
}

export default ConversionCell