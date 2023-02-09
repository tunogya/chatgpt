import {
  Button,
  Divider,
  Heading,
  HStack, IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Stack,
  Text
} from "@chakra-ui/react";
import {FiArrowUpCircle, FiLogOut, FiPlus, FiTrash2} from "react-icons/fi";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import {IoPaperPlaneOutline} from "react-icons/io5";

const Chat = () => {
  const menu = () => {
    return (
      <Stack h={'full'} p={2} bg={'rgba(32,33,35)'} minW={'250px'} w={'250px'}>
        <Button variant={'outline'} boxShadow={'md'} borderColor={'whiteAlpha.400'} leftIcon={<FiPlus color={'white'}/>} _hover={{ bg: '#2A2B32' }}>
          <Text color={'white'} textAlign={"start"} w={'full'}>
            New chat
          </Text>
        </Button>
        <Spacer/>
        <Divider/>
        <Stack spacing={0}>
          <Button variant={'ghost'} leftIcon={<FiTrash2 color={'white'}/>} _hover={{ bg: '#2A2B32' }}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              Clear conversations
            </Text>
          </Button>
          <Button variant={'ghost'} leftIcon={<MoonIcon color={'white'}/>} _hover={{ bg: '#2A2B32' }}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              Dark mode
            </Text>
          </Button>
          <Button variant={'ghost'} leftIcon={<FiArrowUpCircle color={'white'}/>} _hover={{ bg: '#2A2B32' }}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              Updates & FAQ
            </Text>
          </Button>
          <Button variant={'ghost'} leftIcon={<FiLogOut color={'white'}/>} _hover={{ bg: '#2A2B32' }}>
            <Text color={'white'} textAlign={"start"} w={'full'}>
              Log out
            </Text>
          </Button>
        </Stack>
      </Stack>
    )
  }

  const conversation = () => {
    return (
      <Stack w={'full'} h={'full'} position={"relative"}>
        <Stack align={"center"} justify={'center'} h={'full'}>
          <Heading fontSize={'3xl'}>ChatGPT</Heading>
          <Text fontSize={'xs'}></Text>
        </Stack>
        <Stack position={'absolute'} bottom={0} left={0} w={'full'} align={"center"} px={2} pb={3}
               spacing={2}>
          <InputGroup maxW={'container.sm'}>
            <Input variant={'outline'} size={['sm', 'md', 'lg']}/>
            <InputRightElement h={'full'} pr={1}>
              <IconButton aria-label={'send'} icon={<IoPaperPlaneOutline size={'20'}/>} variant={'ghost'}/>
            </InputRightElement>
          </InputGroup>

          <Text fontSize={'xs'} maxW={'container.sm'} textAlign={"center"} px={1} color={'gray.500'}>OpenAI ChatGPT via WizardingPay.</Text>
        </Stack>
      </Stack>
    )
  }

  return (
    <HStack h={'100vh'} spacing={0}>
      {menu()}
      {conversation()}
    </HStack>
  )
}

export default Chat