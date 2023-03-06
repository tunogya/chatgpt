import {
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {IoPaperPlaneOutline} from "react-icons/io5";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ConversationCell, {Message} from "@/_components/ConversationCell";
import {addMessageToSession, setSession, updateMessageAndIdAndTitleToSession} from "@/store/session";
import Head from "next/head";

type ConversationProps = {
  conversation_id?: string | undefined
}

const Conversation: FC<ConversationProps> = ({conversation_id}) => {
  const conversationBg = useColorModeValue('white', 'bg2')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const inputBgColor = useColorModeValue('white', 'bg6')
  const bottomRef = useRef(null);
  const [input, setInput] = useState('');
  const username = useSelector((state: any) => state.user.username);
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const session = useSelector((state: any) => state.session.session);
  const [isWaitComplete, setIsWaitComplete] = useState(false);
  const [isWaitHistory, setIsWaitHistory] = useState(false);
  const dispatch = useDispatch();

  // get current conversation history
  const getHistoryMessageOfSession = useCallback(async () => {
    if (!conversation_id || isWaitHistory) {
      return
    }
    setIsWaitHistory(true);
    let res = await fetch(`/api/conversation/${conversation_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    res = await res.json()
    dispatch(setSession({
      // @ts-ignore
      id: res.SK,
      // @ts-ignore
      title: res.title,
      // @ts-ignore
      messages: res.messages,
    }))
    setIsWaitHistory(false);
  }, [conversation_id])

  useEffect(() => {
    getHistoryMessageOfSession()
  }, [getHistoryMessageOfSession])

  // scroll to bottom when new message
  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [session.messages]);

  // request message to assistant and complete conversation
  const complete = async (message: Message) => {
    setIsWaitComplete(true)
    dispatch(addMessageToSession(message))

    const res = await fetch('/api/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        conversation_id: session.id,
        action: 'next',
        model: 'gpt-3.5-turbo',
        messages: [message],
        parent_message_id: session.messages.length > 0 ? session.messages[session.messages.length - 1].id : undefined,
      }),
    })
    // @ts-ignore
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    // @ts-ignore
    const readChunk = async () => {
      return reader.read().then(({value, done}) => {
        if (!done) {
          const dataString = decoder.decode(value);
          // split data by line, and remove empty line
          const lines = dataString.split('\n\n').filter((line) => line !== '').map((line) => line.trim().replace('data: ', ''));
          for (const line of lines) {
            if (line.startsWith('[DONE]')) {
              setIsWaitComplete(false)
            } else {
              const data = JSON.parse(line);
              dispatch(updateMessageAndIdAndTitleToSession({
                id: data.id,
                title: data.title,
                message: data.messages[0],
              }))
            }
          }
          return readChunk()
        } else {
          setIsWaitComplete(false)
        }
      });
    };

    await readChunk();
  }

  return (
    <Stack w={'full'} h={'full'} position={'relative'} bg={conversationBg} pt={['44px', '44px', 0]}>
      <Head>
        <title>
          {session?.title ? session.title : 'ChatGPT'}
        </title>
      </Head>
      <Stack h={'full'} w={'full'} pb={'120px'} overflow={'scroll'} spacing={0}>
        {
          session?.messages?.length > 0 && ((session?.id && conversation_id) ? session.id?.split('#').pop() === conversation_id : true)
            ? session.messages.map((item: any, index: number) => (
              <ConversationCell message={item} key={index}/>
            )) : (
              !isWaitHistory && (
                <Stack align={'center'} justify={'center'} h={'full'}>
                  <Heading fontSize={'3xl'} color={fontColor}>ChatGPT</Heading>
                  <Text fontSize={'xs'} color={fontColor}>OpenAI 提供技术支持</Text>
                </Stack>
              )
            )}
        <div ref={bottomRef}/>
      </Stack>
      <Stack position={'absolute'} bottom={0} left={0} w={'full'} spacing={0}>
        <Stack px={2} w={'full'} align={'center'}>
          <InputGroup maxW={'container.sm'} boxShadow={'0 0 10px rgba(0, 0, 0, 0.1)'}>
            <Input variant={'outline'} bg={inputBgColor} color={fontColor} value={input}
                   isDisabled={isWaitComplete}
                   onChange={(e) => {
                     setInput(e.target.value)
                   }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (input === '') return;
                        const message: Message = {
                          id: Math.floor(Date.now() / 1000).toString(),
                          role: 'user',
                          content: {
                            type: 'text',
                            parts: [input],
                          },
                          author: {
                            role: 'user',
                            name: username,
                          }
                        }
                        setInput('');
                        await complete(message);
                      }
                    }}
            />
            <InputRightElement h={'full'} pr={1}>
              <IconButton aria-label={'send'} isLoading={isWaitComplete}
                          icon={<IoPaperPlaneOutline color={fontColor} size={'20'}/>} variant={'ghost'}
                          onClick={async (e) => {
                            e.preventDefault();
                            if (input === '') return;
                            const message: Message = {
                              id: Math.floor(Date.now() / 1000).toString(),
                              role: 'user',
                              content: {
                                type: 'text',
                                parts: [input],
                              },
                              author: {
                                role: 'user',
                                name: username,
                              }
                            }
                            setInput('');
                            await complete(message);
                          }}
              />
            </InputRightElement>
          </InputGroup>
        </Stack>
        <Stack w={'full'} bg={conversationBg} align={'center'} pt={2} pb={4}>
          <Text fontSize={'xs'} maxW={'container.sm'} textAlign={'center'} px={1} color={'gray.500'}>OpenAI
            ChatGPT</Text>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Conversation