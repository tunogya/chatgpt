import {
  Box,
  Button, Card,
  Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay,
  HStack, IconButton,
  Input,
  InputGroup,
  InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,
  Spacer,
  Stack,
  Text, useColorMode, useColorModeValue, useDisclosure, useMediaQuery, Wrap, WrapItem,
} from "@chakra-ui/react";
import {FiLogOut, FiPlus, FiTrash2} from "react-icons/fi";
import {AddIcon, HamburgerIcon, MoonIcon, SunIcon} from "@chakra-ui/icons";
import {IoPaperPlaneOutline, IoWalletOutline, IoChatboxOutline} from "react-icons/io5";
import {useRecoilState} from "recoil";
import {jwtAtom} from "@/state";
import {useRouter} from "next/router";
import {RiVipCrown2Line} from "react-icons/ri";
import QuestionCell from "@/components/QuestionCell";
import AnswerCell from "@/components/AnswerCell";
import {useState} from "react";

const Chat = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const conversationBg = useColorModeValue('white', 'bg2')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const inputBgColor = useColorModeValue('white', 'bg6')
  const [, setJWT] = useRecoilState(jwtAtom)
  const router = useRouter()
  const [isMobile] = useMediaQuery('(max-width: 768px)') // init is false
  const {isOpen: isOpenMobileMenu, onOpen: onOpenMobileMenu, onClose: onCLoseMobileMenu} = useDisclosure()
  const {isOpen: isOpenCoins, onOpen: onOpenCoins, onClose: onCLoseCoins} = useDisclosure()
  const {isOpen: isOpenPass, onOpen: onOpenPass, onClose: onCLosePass} = useDisclosure()
  const [conversations, setConversations] = useState([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const complete = async (input: string) => {
    setOutput("");
    setLoading(true);
    const response = await fetch("/api/openai/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const {value, done: doneReading} = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setOutput((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  const moderate = async (input: string) => {
    if (!input) {
      return
    }
    const res = await fetch("/moderations", {
      method: "POST",
      body: JSON.stringify({
        input: input,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res.json())
  }

  const menu = () => {
    return (
      <Stack h={'full'} p={2} spacing={2} bg={'bg1'} minW={'260px'} w={['full', 'full', '260px']}
             opacity={[isOpenMobileMenu ? 1 : 0, 1]}>
        <Button variant={'outline'} boxShadow={'md'} h={'46px'} borderColor={'whiteAlpha.400'}
                leftIcon={<FiPlus color={'white'}/>}
                _hover={{bg: 'bg3'}}>
          <Text color={'white'} textAlign={"start"} w={'full'}>
            New chat
          </Text>
        </Button>
        <Stack pt={2}>
          <Button variant={"ghost"} leftIcon={<IoChatboxOutline color={'white'}/>} _hover={{bg: 'bg3'}}>
            <Text color={'gray.50'} textAlign={"start"} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'} fontSize={'sm'}>
              What is this? How does it work?
            </Text>
          </Button>
        </Stack>
        <Spacer/>
        <Stack spacing={1}>
          <Box w={'full'} h={'1px'} bg={"whiteAlpha.400"}/>
          <Button variant={'ghost'} leftIcon={<FiTrash2 color={'white'}/>} _hover={{bg: 'bg3'}}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              Clear conversations
            </Text>
          </Button>
          <Button variant={'ghost'} leftIcon={<IoWalletOutline color={'white'}/>} _hover={{bg: 'bg3'}}
                  onClick={onOpenCoins}>
            <Text color={'white'} textAlign={"start"} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
                  pr={'2px'}>
              Balance
            </Text>
            <Text color={'white'} textAlign={"end"} fontSize={'sm'}>
              {(1000).toLocaleString()} Coins
            </Text>
          </Button>
          <Modal isOpen={isOpenCoins} onClose={onCLoseCoins} isCentered size={['xs', 'sm', 'md']}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader color={fontColor} px={[2, 4]}>Recharge Coins</ModalHeader>
              <ModalCloseButton color={fontColor}/>
              <ModalBody pt={0} pb={3} px={[2, 4]}>
                <Stack spacing={3} minH={'300px'}>
                  <Wrap justify={"space-between"} spacing={3}>
                    {[3, 6, 12, 30, 50, 98].map((item) => (
                      <WrapItem key={item}>
                        <Button minW={['140px', '140px', '120px']} variant={'outline'} _hover={{boxShadow: 'md'}}>
                          {item} Coins
                        </Button>
                      </WrapItem>
                    ))}
                  </Wrap>
                  <Text fontSize={'xs'} color={fontColor}>
                    Tips: recharge is valid forever.
                  </Text>
                  <Spacer/>
                  <Text fontSize={'sm'} color={fontColor}>My balance: 1000 Coins</Text>
                </Stack>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Button variant={'ghost'} leftIcon={<RiVipCrown2Line color={'gold'}/>} _hover={{bg: 'bg3'}}
                  onClick={onOpenPass}>
            <Text color={'white'} textAlign={"start"} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
                  pr={'2px'}>
              Priority Pass
            </Text>
            <Text color={'white'} textAlign={"end"} fontSize={'sm'}>
              {(3650).toLocaleString()} Days
            </Text>
          </Button>
          <Modal isOpen={isOpenPass} onClose={onCLosePass} isCentered size={['xs', 'sm', 'md']}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader color={fontColor} px={[2, 4]}>Recharge Pass</ModalHeader>
              <ModalCloseButton color={fontColor}/>
              <ModalBody pt={0} pb={3} px={[2, 4]}>
                <Stack spacing={3} minH={'300px'}>
                  <Card p={3} variant={'outline'} cursor={"pointer"}>
                    <Stack>
                      <Text color={fontColor} fontSize={'sm'} fontWeight={"500"}>Free Pass</Text>
                      <Text fontSize={'xx-small'} color={fontColor}>
                        The Free Pass presents experience benefits for the ChatGPT.
                      </Text>
                      <br/>
                      <HStack spacing={1} align={"baseline"}>
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
                  {/*      <Text color={fontColor} fontSize={'sm'} fontWeight={"500"}>Priority Pass</Text>*/}
                  {/*    </HStack>*/}
                  {/*    <br/>*/}
                  {/*    <HStack spacing={1} align={"baseline"}>*/}
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
                  <Wrap justify={"space-between"} spacing={3}>
                    {['Annual', 'Quarter', 'Monthly'].map((item) => (
                      <WrapItem key={item}>
                        <Button w={['140px', '140px', '120px']} variant={'outline'} _hover={{boxShadow: 'md'}}
                                h={'60px'}>
                          <Stack w={'full'}>
                            <Text textAlign={"start"} fontSize={'xs'} color={fontColor}
                                  fontWeight={'500'}>{item}</Text>
                            <Text textAlign={"start"} fontSize={'sm'} color={fontColor}>200</Text>
                          </Stack>
                        </Button>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Stack>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Button variant={'ghost'}
                  leftIcon={colorMode === 'light' ? <MoonIcon color={'white'}/> : <SunIcon color={'white'}/>}
                  _hover={{bg: 'bg3'}} onClick={toggleColorMode}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              {colorMode === 'light' ? 'Dark' : 'Light'} mode
            </Text>
          </Button>
          {/*<Button variant={'ghost'} leftIcon={<FiArrowUpCircle color={'white'}/>} _hover={{bg: 'bg3'}}>*/}
          {/*  <Text color={'white'} textAlign={"start"} w={'full'}>*/}
          {/*    Updates & FAQ*/}
          {/*  </Text>*/}
          {/*</Button>*/}
          <Button variant={'ghost'} leftIcon={<FiLogOut color={'white'}/>} _hover={{bg: 'bg3'}}>
            <Text color={'white'} textAlign={"start"} w={'full'} onClick={() => {
              setJWT('')
              router.push('/auth/login')
            }}>
              Log out
            </Text>
          </Button>
        </Stack>
      </Stack>
    )
  }

  const menuMobile = () => {
    return (
      <HStack h={'44px'} w={'full'} position={'absolute'} top={0} left={0} zIndex={'docked'} borderBottom={'1px solid'}
              align={"center"} justify={"space-between"} bg={conversationBg} borderColor={'gray.100'} px={1}
              boxShadow={'sm'}>
        <IconButton aria-label={'menu'} icon={<HamburgerIcon fontSize={'sm'}/>} onClick={onOpenMobileMenu}
                    variant={"ghost"}/>
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
        <IconButton aria-label={'add'} icon={<AddIcon fontSize={'sm'}/>} variant={"ghost"}/>
      </HStack>
    )
  }

  const conversation = () => {
    return (
      <Stack w={'full'} h={'full'} position={"relative"} bg={conversationBg} pt={['44px', '44px', 0]}>
        <Stack h={'full'} w={'full'} pb={'120px'} overflow={"scroll"}>
          <QuestionCell name={'t'} text={input}/>
          <AnswerCell text={output}/>
        </Stack>
        {/*<Stack align={"center"} justify={'center'} h={'full'}>*/}
        {/*  <Heading fontSize={'3xl'} color={fontColor}>ChatGPT</Heading>*/}
        {/*  <Text fontSize={'xs'}></Text>*/}
        {/*</Stack>*/}
        <Stack position={'absolute'} bottom={0} left={0} w={'full'} spacing={0}>
          <Stack px={2} w={'full'} align={"center"}>
            <InputGroup maxW={'container.sm'} boxShadow={'0 0 10px rgba(0, 0, 0, 0.1)'}>
              <Input variant={'outline'} bg={inputBgColor} color={fontColor} size={['sm', 'md', 'lg']}
                     onChange={(e) => {
                       setInput(e.target.value)
                     }}/>
              <InputRightElement h={'full'} pr={1}>
                <IconButton aria-label={'send'} isLoading={loading}
                            icon={<IoPaperPlaneOutline color={fontColor} size={'20'}/>}
                            onClick={() => {
                              moderate(input)
                              complete(input)
                            }}
                            variant={'ghost'}/>
              </InputRightElement>
            </InputGroup>
          </Stack>
          <Stack w={'full'} bg={conversationBg} align={"center"} pt={2} pb={4}>
            <Text fontSize={'xs'} maxW={'container.sm'} textAlign={"center"} px={1} color={'gray.500'}>OpenAI ChatGPT
              via
              WizardingPay.</Text>
          </Stack>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack direction={['column', 'column', 'row']} h={'100vh'} w={'full'} spacing={0}>
      {isMobile ? menuMobile() : menu()}
      {conversation()}
    </Stack>
  )
}

export default Chat