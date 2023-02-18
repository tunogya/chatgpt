import {chakra, HStack, Stack, Text, useColorModeValue} from '@chakra-ui/react';
import {FC} from 'react';

export type Message = {
  id: string
  role: 'ai' | 'user'
  content: {
    type: 'text' | 'image' | 'video' | 'audio' | 'file'
    parts: string[]
  },
  create_at: number,
}

const ConversationCell: FC<{message: Message}> = ({message}) => {
  const chatBgColor = useColorModeValue('#F7F7F8', 'bg4')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const {role, content} = message

  const isAi = role === 'ai'

  return (
    <Stack bg={isAi ? chatBgColor : ''} border={isAi ? '1px solid' : 'none'} borderColor={'rgba(0,0,0,0.1)'} w={'full'}
           py={6} px={4} align={'center'}>
      <HStack maxW={['full', 'container.md']} w={'full'} h={'full'} spacing={6} align={'start'}>
        <Stack bg={isAi ? '#10A37F' : 'bg5'} minW={'30px'} w={'30px'} h={'30px'} p={1} borderRadius={'2px'}>
          <chakra.img src={isAi ? '/openai.svg' : '/icon.svg'}/>
        </Stack>
        <Text color={fontColor} fontSize={'md'} fontWeight={'500'}>{content.parts[0]}</Text>
      </HStack>
    </Stack>
  )
}

export default ConversationCell