import {Avatar, chakra, HStack, Stack, Text, useColorModeValue} from '@chakra-ui/react';
import {FC} from 'react';

type Role = 'user' | 'bot'

type ContentType = 'text'

export type Message = {
  id: string,
  role: Role,
  content: {
    content_type: ContentType,
    parts: any[],
  },
}

const ConversionCell: FC<{message: Message}> = ({message}) => {
  const chatBgColor = useColorModeValue('#F7F7F8', 'bg4')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const {role, content} = message

  return (
    <Stack bg={role === 'bot' ? chatBgColor : ''} border={role === 'bot' ? '1px solid' : 'none'} borderColor={'rgba(0,0,0,0.1)'} w={'full'}
           py={6} px={4} align={'center'}>
      <HStack maxW={['full', 'container.md']} w={'full'} h={'full'} spacing={6} align={'start'}>
        {role === 'bot' ? (
          <Stack bg={'rgb(16, 163, 127)'} minW={'30px'} w={'30px'} h={'30px'} p={1} borderRadius={'2px'}>
            <chakra.img src={'/openai.svg'}/>
          </Stack>
        ) : (
          <Avatar borderRadius={'2px'} minW={'30px'} w={'30px'} h={'30px'} iconLabel={'icon'} size={'md'} name={'user'}
                  textTransform={'none'} bg={'bg5'}/>
        )}
        <Text color={fontColor} fontSize={'md'} fontWeight={'500'}>{content.parts[0]}</Text>
      </HStack>
    </Stack>
  )
}

export default ConversionCell