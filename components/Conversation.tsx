import {
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorMode,
  useColorModeValue, useDisclosure, useMediaQuery
} from "@chakra-ui/react";
import {IoPaperPlaneOutline} from "react-icons/io5";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {v4 as uuidv4} from 'uuid';
import ConversationCell, {Message} from "@/components/ConversationCell";

const Conversation = () => {
  const conversationBg = useColorModeValue('white', 'bg2')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const inputBgColor = useColorModeValue('white', 'bg6')
  const bottomRef = useRef(null);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('IDLE');
  const jwt = useSelector((state: any) => state.auth.token);
  const [session, setSession] = useState({
    id: undefined,
    title: 'New Chat',
    messages: [] as Message[],
  });

  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  // const {action, messages, model, parent_message_id} = req.body;
  //       let conversation_id = req.body?.conversation_id || undefined;
  const complete = async () => {
    const res = await fetch('/api/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        conversation_id: session.id,
        action: 'next',
        model: 'text-davinci-003',
        messages: [session.messages.pop()],
        parent_message_id: session.messages.length > 0 ? session.messages[session.messages.length - 1]?.id : undefined,
      }),
    })
  }

  return (
    <Stack w={'full'} h={'full'} position={'relative'} bg={conversationBg} pt={['44px', '44px', 0]}>
      <Stack h={'full'} w={'full'} pb={'120px'} overflow={'scroll'} spacing={0}>
        {
          session.messages && session.messages?.length > 0 ? session.messages.map((item, index) => (
            <ConversationCell message={item} key={index}/>
          )) : (
            <Stack align={'center'} justify={'center'} h={'full'}>
              <Heading fontSize={'3xl'} color={fontColor}>ChatGPT</Heading>
              <Text fontSize={'xs'} color={fontColor}>Power by OpenAI</Text>
            </Stack>
          )}
        <div ref={bottomRef}/>
      </Stack>
      <Stack position={'absolute'} bottom={0} left={0} w={'full'} spacing={0}>
        <Stack px={2} w={'full'} align={'center'}>
          <InputGroup maxW={'container.sm'} boxShadow={'0 0 10px rgba(0, 0, 0, 0.1)'}>
            <Input variant={'outline'} bg={inputBgColor} color={fontColor} size={['sm', 'md']} value={input}
                   isDisabled={status === 'LOADING'}
                   onChange={(e) => {
                     setInput(e.target.value)
                   }}
            />
            <InputRightElement h={'full'} pr={1}>
              <IconButton aria-label={'send'} isLoading={status === 'LOADING'}
                          icon={<IoPaperPlaneOutline color={fontColor} size={'20'}/>} variant={'ghost'}
                          onClick={async (e) => {
                            e.preventDefault();
                            if (input === '') return;
                            setSession({
                              ...session,
                              messages: [...session.messages, {
                                id: uuidv4(),
                                role: 'user',
                                content: {
                                  type: 'text',
                                  parts: [input],
                                }
                              }]
                            })
                            setInput('');
                          }}
              />
            </InputRightElement>
          </InputGroup>
        </Stack>
        <Stack w={'full'} bg={conversationBg} align={'center'} pt={2} pb={4}>
          <Text fontSize={'xs'} maxW={'container.sm'} textAlign={'center'} px={1} color={'gray.500'}>OpenAI ChatGPT
            via
            WizardingPay.</Text>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Conversation