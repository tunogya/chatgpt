import {Button, Divider, Heading, HStack, Spacer, Stack, Text} from "@chakra-ui/react";
import {FiArrowUpCircle, FiLogOut, FiTrash2} from "react-icons/fi";

const Chat = () => {
  const menu = () => {
    return (
      <Stack h={'full'} p={2} bg={'rgba(32,33,35)'} minW={'250px'} w={'250px'}>
        <Button variant={'outline'} color={'white'} fontSize={'sm'} fontWeight={'semibold'}>New chat</Button>
        <Spacer/>
        <Divider/>
        <Button variant={'ghost'} leftIcon={<FiTrash2 color={'white'}/>}>
          <Text color={'white'} fontSize={'sm'} fontWeight={'semibold'} textAlign={"start"} w={'full'}>
            Clear conversations
          </Text>
        </Button>
        <Button variant={'ghost'} leftIcon={<FiArrowUpCircle color={'white'}/>}>
          <Text color={'white'} fontSize={'sm'} fontWeight={'semibold'} textAlign={"start"} w={'full'}>
            Updates & FAQ
          </Text>
        </Button>
        <Button variant={'ghost'} leftIcon={<FiLogOut color={'white'}/>}>
          <Text color={'white'} fontSize={'sm'} fontWeight={'semibold'} textAlign={"start"} w={'full'}>
            Log out
          </Text>
        </Button>
      </Stack>
    )
  }

  const conversation = () => {
    return (
      <Stack w={'full'} h={'full'} align={"center"} justify={"center"}>
        <Heading fontSize={'3xl'}>ChatGPT</Heading>
      </Stack>
    )
  }

  return (
    <HStack h={'100vh'}>
      {menu()}
      {conversation()}
    </HStack>
  )
}

export default Chat