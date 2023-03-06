import {Avatar, Box, chakra, HStack, Stack, useColorModeValue} from '@chakra-ui/react';
import {FC} from 'react';
import {useSelector} from "react-redux";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

export type Message = {
  id: string
  role: 'assistant' | 'user' | 'system'
  content: {
    type: 'text' | 'image' | 'video' | 'audio' | 'file'
    parts: string[]
  },
  author: {
    role: 'assistant' | 'user' | 'system',
    name?: string,
    metadata?: {}
  }
}

const ConversationCell: FC<{ message: Message }> = ({message}) => {
  const chatBgColor = useColorModeValue('#F7F7F8', 'bg4')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const photo_url = useSelector((state: any) => state.user.photo_url)
  const username = useSelector((state: any) => state.user.username)
  const {role, content} = message

  const isAiOrPay = role !== 'user'

  return (
    <Stack bg={isAiOrPay ? chatBgColor : ''} border={isAiOrPay ? '1px solid' : 'none'} borderColor={'rgba(0,0,0,0.1)'}
           w={'full'}
           py={6} px={4} align={'center'}>
      <HStack maxW={['full', 'container.md']} w={'full'} h={'full'} spacing={6} align={'start'}>
        {
          role === 'user' ? (
            <Avatar w={'30px'} bg={"gray.200"} h={'30px'} borderRadius={'2px'} name={username} src={photo_url}/>
          ) : (
            <Stack bg={role === 'assistant' ? '#10A37F' : 'bg5'} minW={'30px'} w={'30px'} h={'30px'} p={1} borderRadius={'2px'}
                   userSelect={"none"}>
              <chakra.img src={role === 'assistant' ? '/openai.svg' : '/icon.svg'}/>
            </Stack>
          )
        }
        {/*<Text color={fontColor} fontSize={'md'} fontWeight={'500'} whiteSpace={'pre-wrap'}>{content.parts[0]}</Text>*/}
        <Box color={fontColor} pt={1}>
          <ReactMarkdown rehypePlugins={[rehypeHighlight, remarkGfm]} className={'markdown-body'}>
            {content.parts[0]}
          </ReactMarkdown>
        </Box>
      </HStack>
    </Stack>
  )
}

export default ConversationCell