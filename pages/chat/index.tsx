import {
  Box,
  Button,
  Card,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
  Heading,
  DrawerBody,
  DrawerHeader, SimpleGrid,
} from '@chakra-ui/react';
import {FiLogOut, FiPlus, FiTrash2} from 'react-icons/fi';
import {AddIcon, HamburgerIcon, MoonIcon, SunIcon} from '@chakra-ui/icons';
import {IoPaperPlaneOutline, IoWalletOutline, IoChatboxOutline} from 'react-icons/io5';
import {useRecoilState} from 'recoil';
import {jwtAtom} from '@/state';
import {useRouter} from 'next/router';
import {RiVipCrown2Line} from 'react-icons/ri';
import ConversionCell, {Message} from '@/components/ConversionCell';
import {useCallback, useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

type Conversation = {
  id: string,
  title: string,
}

const Chat = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const conversationBg = useColorModeValue('white', 'bg2')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const inputBgColor = useColorModeValue('white', 'bg6')
  const [jwt, setJWT] = useRecoilState(jwtAtom)
  const router = useRouter()
  const [isMobile] = useMediaQuery('(max-width: 768px)') // init is false
  const {isOpen: isOpenMobileMenu, onOpen: onOpenMobileMenu, onClose: onCLoseMobileMenu} = useDisclosure()
  const {isOpen: isOpenCoins, onOpen: onOpenCoins, onClose: onCLoseCoins} = useDisclosure()
  const {isOpen: isOpenPass, onOpen: onOpenPass, onClose: onClosePass} = useDisclosure()
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | undefined>(undefined);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [input, setInput] = useState('');
  const [status, setStatus] = useState('IDLE');

  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const getConversationList = useCallback(async () => {
    const response = await fetch('/api/conversation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    setConversations(data.items);
  }, [jwt]);

  useEffect(() => {
    getConversationList()
  }, [getConversationList])

  const complete = async (input: string) => {
    setStatus('LOADING');
    const response = await fetch('/api/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        conversation_id: undefined,
        action: "next",
        messages: [
          {
            id: `MESSAGE#${uuidv4()}`,
            role: "user",
            content: {
              content_type: "text",
              parts: [input]
            }
          }
        ],
        model: "text-davinci-003",
        parent_message_id: "",
      }),
    });

    // test
    const {id, title} = await response.json()
    setCurrentConversation({
      id,
      title,
    });

    // if (!response.ok) {
    //   setStatus('ERROR')
    //   setTimeout(() => {
    //     setStatus('IDLE')
    //   }, 3_000)
    //   throw new Error(response.statusText);
    // }
    //
    // const data = response.body;
    // if (!data) {
    //   return;
    // }
    // const reader = data.getReader();
    // const decoder = new TextDecoder();
    // let done = false;
    //
    // let chunkValue = '';
    // while (!done) {
    //   const {value, done: doneReading} = await reader.read();
    //   done = doneReading;
    //   chunkValue = decoder.decode(value);
    //   // setOutput((prev) => prev + chunkValue);
    // }

    // FOR TEST
    setMessages((prev) => [...prev, {
      id: '83cc9d48-c6f3-4b1d-94a2-6603331a5df9',
      role: 'bot',
      content: {
        content_type: 'text',
        parts: ["Demo Data"],
      },
    }]);
    setStatus('IDLE');
  };

  const moderate = async (input: string) => {
    if (!input) {
      return
    }
    const res = await fetch('/api/openai/moderations', {
      method: 'POST',
      body: JSON.stringify({
        input: input,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(res.json())
  };

  const coinsBody = () => {
    return (
      <Stack spacing={3} minH={'300px'}>
        <SimpleGrid columns={[2, null, 3]} spacing={3}>
          {[3, 6, 12, 30, 50, 98].map((item) => (
            <Button key={item} w={['full', 'full', '120px']} variant={'outline'} _hover={{boxShadow: 'md'}}>
              {item} Coins
            </Button>
          ))}
        </SimpleGrid>
        <Text fontSize={'xs'} color={fontColor}>
          Tips: recharge is valid forever.
        </Text>
        <Spacer/>
        <Text fontSize={'sm'} color={fontColor}>My balance: 1000 Coins</Text>
      </Stack>
    )
  }

  const coinsModalAndDrawer = () => {
    if (isMobile) {
      return (
        <Drawer placement={'bottom'} onClose={onCLoseCoins} isOpen={isOpenCoins}>
          <DrawerContent borderTopRadius={'20px'} overflow={'hidden'}>
            <DrawerHeader color={fontColor} px={[3, 4]}>Recharge Coins</DrawerHeader>
            <DrawerBody pt={0} pb={3} px={[3, 4]}>
              {coinsBody()}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )
    } else {
      return (
        <Modal isOpen={isOpenCoins} onClose={onCLoseCoins} isCentered>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader color={fontColor} px={[3, 4]}>Recharge Coins</ModalHeader>
            <ModalCloseButton color={fontColor}/>
            <ModalBody pt={0} pb={3} px={[3, 4]}>
              {coinsBody()}
            </ModalBody>
          </ModalContent>
        </Modal>
      )
    }
  }

  const passBody = () => {
    return (
      <Stack spacing={3} minH={'300px'}>
        <Card p={3} variant={'outline'} cursor={'pointer'}>
          <Stack>
            <Text color={fontColor} fontSize={'sm'} fontWeight={'500'}>Free Pass</Text>
            <Text fontSize={'xx-small'} color={fontColor}>
              The Free Pass presents experience benefits for the ChatGPT.
            </Text>
            <br/>
            <HStack spacing={1} align={'baseline'}>
              <Text color={fontColor} fontSize={'xs'} fontWeight={'500'}>
                365 days
              </Text>
              <Text color={fontColor} fontSize={'xs'} fontWeight={'500'}>
                · expired on 3.19
              </Text>
            </HStack>
          </Stack>
        </Card>
        {/*<Card p={3} variant={'outline'} cursor={'pointer'}>*/}
        {/*  <Stack h={'full'}>*/}
        {/*    <HStack>*/}
        {/*      <RiVipCrown2Line color={'gold'}/>*/}
        {/*      <Text color={fontColor} fontSize={'sm'} fontWeight={'500'}>Priority Pass</Text>*/}
        {/*    </HStack>*/}
        {/*    <br/>*/}
        {/*    <HStack spacing={1} align={'baseline'}>*/}
        {/*      <Text color={fontColor} fontSize={'xs'} fontWeight={'500'}>*/}
        {/*        365 days*/}
        {/*      </Text>*/}
        {/*      <Text color={fontColor} fontSize={'xx-small'} fontWeight={'500'}>*/}
        {/*        · expired on 3.19*/}
        {/*      </Text>*/}
        {/*    </HStack>*/}
        {/*  </Stack>*/}
        {/*</Card>*/}
        <br/>
        <Text fontSize={'sm'} fontWeight={'500'} color={fontColor}>Join Priority Pass</Text>
        <SimpleGrid columns={[2, null, 3]} spacing={3}>
          {['Annual', 'Quarter', 'Monthly'].map((item) => (
            <Button key={item} w={['full', 'full', '120px']} variant={'outline'} _hover={{boxShadow: 'md'}}>
              <HStack w={'full'} justify={"space-between"}>
                <Text textAlign={'start'} fontSize={'xs'} color={fontColor}
                      fontWeight={'500'}>{item}</Text>
                <Text textAlign={'start'} fontSize={'sm'} color={fontColor}>200</Text>
              </HStack>
            </Button>
          ))}
        </SimpleGrid>
      </Stack>
    )
  }

  const passModalAndDrawer = () => {
    if (isMobile) {
      return (
        <Drawer placement={'bottom'} onClose={onClosePass} isOpen={isOpenPass}>
          <DrawerContent borderTopRadius={'20px'} overflow={'hidden'}>
            <DrawerHeader color={fontColor} px={[3, 4]}>Recharge Pass</DrawerHeader>
            <DrawerBody pt={0} pb={3} px={[3, 4]}>
              {passBody()}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )
    } else {
      return (
        <Modal isOpen={isOpenPass} onClose={onClosePass} isCentered size={['xs', 'sm', 'md']}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader color={fontColor} px={[3, 4]}>Recharge Pass</ModalHeader>
            <ModalCloseButton color={fontColor}/>
            <ModalBody pt={0} pb={3} px={[3, 4]}>
              {passBody()}
            </ModalBody>
          </ModalContent>
        </Modal>
      )
    }
  }

  const menu = () => {
    return (
      <Stack h={'full'} p={2} spacing={2} bg={'bg1'} minW={'260px'} w={['full', 'full', '260px']}
             opacity={[isOpenMobileMenu ? 1 : 0, 1]}>
        <Button variant={'outline'} boxShadow={'md'} h={'46px'} borderColor={'whiteAlpha.400'}
                leftIcon={<FiPlus color={'white'}/>} justifyContent={"start"} gap={1} color={"white"}
                _hover={{bg: 'bg3'}}>
          New chat
        </Button>
        <Stack pt={2} h={'full'} overflow={"scroll"}>
          {conversations.map((item) => (
            <Button key={item.id} variant={'ghost'} leftIcon={<IoChatboxOutline color={'white'}/>} gap={1}
                    _hover={{bg: 'bg3'}}>
              <Text color={'gray.50'} textAlign={'start'} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'} fontSize={'sm'}>
                {item.title}
              </Text>
            </Button>
          ))}
        </Stack>
        <Spacer/>
        <Stack spacing={1}>
          <Box w={'full'} h={'1px'} bg={'whiteAlpha.400'}/>
          <Button variant={'ghost'} leftIcon={<FiTrash2 color={'white'}/>} gap={1} justifyContent={"start"}
                  color={'white'}
                  _hover={{bg: 'bg3'}}>
            Clear conversations
          </Button>
          <Button variant={'ghost'} leftIcon={<IoWalletOutline color={'white'}/>} _hover={{bg: 'bg3'}} gap={1}
                  onClick={onOpenCoins}>
            <Text color={'white'} textAlign={'start'} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
                  pr={'2px'}>
              Balance
            </Text>
            <Text color={'white'} textAlign={'end'} fontSize={'sm'}>
              {(1000).toLocaleString()} Coins
            </Text>
          </Button>
          {coinsModalAndDrawer()}
          <Button variant={'ghost'} leftIcon={<RiVipCrown2Line color={'gold'}/>} _hover={{bg: 'bg3'}} gap={1}
                  onClick={onOpenPass}>
            <Text color={'white'} textAlign={'start'} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
                  pr={'2px'}>
              Priority Pass
            </Text>
            <Text color={'white'} textAlign={'end'} fontSize={'sm'}>
              {(3650).toLocaleString()} Days
            </Text>
          </Button>
          {passModalAndDrawer()}
          <Button variant={'ghost'} gap={1} justifyContent={'start'} color={"white"}
                  leftIcon={colorMode === 'light' ? <MoonIcon color={'white'}/> : <SunIcon color={'white'}/>}
                  _hover={{bg: 'bg3'}} onClick={toggleColorMode}>
            {colorMode === 'light' ? 'Dark' : 'Light'} mode
          </Button>
          <Button variant={'ghost'} leftIcon={<FiLogOut color={'white'}/>} justifyContent={"start"} gap={1}
                  color={'white'}
                  _hover={{bg: 'bg3'}}
                  onClick={() => {
                    router.push('/auth/login')
                      .then(() => {
                        setJWT('')
                      })
                  }}>
            Log out
          </Button>
        </Stack>
      </Stack>
    )
  };

  const menuMobile = () => {
    return (
      <HStack h={'44px'} w={'full'} position={'absolute'} top={0} left={0} zIndex={'docked'} borderBottom={'1px solid'}
              align={'center'} justify={'space-between'} bg={conversationBg} borderColor={'gray.100'} px={1}
              boxShadow={'sm'}>
        <IconButton aria-label={'menu'} icon={<HamburgerIcon fontSize={'sm'}/>} onClick={onOpenMobileMenu}
                    variant={'ghost'}/>
        <Drawer
          isOpen={isOpenMobileMenu}
          placement='left'
          onClose={onCLoseMobileMenu}
        >
          <DrawerOverlay/>
          <DrawerContent>
            <DrawerCloseButton position={'absolute'} border={'1px solid'} color={fontColor} right={'-40px'}/>
            {menu()}
          </DrawerContent>
        </Drawer>
        <Text color={fontColor} fontSize={'md'} fontWeight={'500'}>New chat</Text>
        <IconButton aria-label={'add'} icon={<AddIcon fontSize={'sm'}/>} variant={'ghost'}/>
      </HStack>
    )
  };

  const conversation = () => {
    return (
      <Stack w={'full'} h={'full'} position={'relative'} bg={conversationBg} pt={['44px', '44px', 0]}>
        <Stack h={'full'} w={'full'} pb={'120px'} overflow={'scroll'} spacing={0}>
          {
            messages.length > 0 ? messages.map((item, index) => (
              <ConversionCell message={item} key={index}/>
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
                              const text = input;
                              setInput('')
                              setMessages([...messages, {
                                id: '1',
                                role: 'user',
                                content: {
                                  content_type: 'text',
                                  parts: [text]
                                }
                              }])
                              // moderate(input)
                              await complete(text)
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
  };

  return (
    <Stack direction={['column', 'column', 'row']} h={'full'} w={'full'} spacing={0}>
      {isMobile ? menuMobile() : menu()}
      {conversation()}
    </Stack>
  )
}

export default Chat