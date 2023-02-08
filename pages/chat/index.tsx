import {Button, Divider, HStack, Spacer, Stack, Text} from "@chakra-ui/react";

const Chat = () => {
  const menu = () => {
    return (
      <Stack>
        <Button>New chat</Button>
        <Spacer/>
        <Divider/>
        <Button>
          Clear conversations
        </Button>
        <Button>
          Updates & FAQ
        </Button>
        <Button>
          Log out
        </Button>
      </Stack>
    )
  }

  const conversation = () => {
    return (
      <Stack>
        <Text>Conversation</Text>
      </Stack>
    )
  }

  return (
    <HStack>
      {menu()}
      {conversation()}
    </HStack>
  )
}

export default Chat