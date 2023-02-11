import {
  Button,
  Divider, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay,
  Heading,
  HStack, IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Stack,
  Text, useColorMode, useColorModeValue, useDisclosure, useMediaQuery,
} from "@chakra-ui/react";
import {FiArrowUpCircle, FiLogOut, FiPlus, FiTrash2} from "react-icons/fi";
import {AddIcon, ChatIcon, HamburgerIcon, MoonIcon, SunIcon} from "@chakra-ui/icons";
import {IoPaperPlaneOutline} from "react-icons/io5";
import {useRecoilState} from "recoil";
import {jwtAtom} from "@/state";
import {useRouter} from "next/router";

const Chat = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const conversationBg = useColorModeValue('white', '#343541')
  const fontColor = useColorModeValue('black', '#ECECF1')
  const [, setJWT] = useRecoilState(jwtAtom)
  const router = useRouter()
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const menu = () => {
    return (
      <Stack h={'full'} p={2} spacing={2} bg={'#202123'} minW={'250px'} w={['full', '250px']}>
        <Button variant={'outline'} boxShadow={'md'} h={'46px'} borderColor={'whiteAlpha.400'} leftIcon={<FiPlus color={'white'}/>}
                _hover={{bg: '#2A2B32'}}>
          <Text color={'white'} textAlign={"start"} w={'full'}>
            New chat
          </Text>
        </Button>
        <Stack pt={2}>
          <Button variant={"ghost"} leftIcon={<ChatIcon color={'white'}/>} _hover={{bg: '#2A2B32'}}>
            <Text color={'gray.50'} textAlign={"start"} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'nowrap'}>
              What is this? How does it work?
            </Text>
          </Button>
        </Stack>
        <Spacer/>
        <Divider bg={'white'}/>
        <Stack spacing={0}>
          <Button variant={'ghost'} leftIcon={<FiTrash2 color={'white'}/>} _hover={{bg: '#2A2B32'}}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              Clear conversations
            </Text>
          </Button>
          <Button variant={'ghost'} leftIcon={colorMode === 'light' ? <MoonIcon color={'white'}/> : <SunIcon color={'white'}/>}
                  _hover={{bg: '#2A2B32'}} onClick={toggleColorMode}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              {colorMode === 'light' ? 'Dark' : 'Light'} mode
            </Text>
          </Button>
          <Button variant={'ghost'} leftIcon={<FiArrowUpCircle color={'white'}/>} _hover={{bg: '#2A2B32'}}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              Updates & FAQ
            </Text>
          </Button>
          <Button variant={'ghost'} leftIcon={<FiLogOut color={'white'}/>} _hover={{bg: '#2A2B32'}}>
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
              align={"center"} justify={"space-between"} borderColor={'gray.100'} px={1} boxShadow={'sm'}>
        <IconButton aria-label={'menu'} icon={<HamburgerIcon fontSize={'sm'}/>} onClick={onOpen} variant={"ghost"}/>
        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton position={'absolute'} border={'1px solid'} color={fontColor} right={'-40px'}/>
            {menu()}
          </DrawerContent>
        </Drawer>
        <Text color={fontColor}>New chat</Text>
        <IconButton aria-label={'add'} icon={<AddIcon fontSize={'sm'}/>} variant={"ghost"}/>
      </HStack>
    )
  }

  const conversation = () => {
    return (
      <Stack w={'full'} h={'full'} position={"relative"} bg={conversationBg}>
        <Stack align={"center"} justify={'center'} h={'full'}>
          <Heading fontSize={'3xl'} color={fontColor}>ChatGPT</Heading>
          <Text fontSize={'xs'}></Text>
        </Stack>
        <Stack position={'absolute'} bottom={0} left={0} w={'full'} align={"center"} px={2} pb={3}
               spacing={2}>
          <InputGroup maxW={'container.sm'} boxShadow={'0 0 10px rgba(0, 0, 0, 0.1)'}>
            <Input variant={'outline'} size={['sm', 'md', 'lg']}/>
            <InputRightElement h={'full'} pr={1}>
              <IconButton aria-label={'send'} icon={<IoPaperPlaneOutline color={fontColor} size={'20'}/>} variant={'ghost'}/>
            </InputRightElement>
          </InputGroup>
          <Text fontSize={'xs'} maxW={'container.sm'} textAlign={"center"} px={1} color={'gray.500'}>OpenAI ChatGPT via
            WizardingPay.</Text>
        </Stack>
      </Stack>
    )
  }

  return (
    <HStack h={'100vh'} w={'full'} spacing={0}>
      { isMobile ? menuMobile() : menu()}
      {conversation()}
    </HStack>
  )
}

export default Chat