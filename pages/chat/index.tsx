import {
  Stack,
  useMediaQuery,
} from '@chakra-ui/react';
import MenuMobile from "@/components/MenuMobile";
import Menu from "@/components/Menu";
import Conversation from "@/components/Conversation";

const Chat = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  return (
    <Stack direction={['column', 'column', 'row']} h={'full'} w={'full'} spacing={0}>
      {isMobile ? <MenuMobile/> : <Menu/>}
      <Conversation/>
    </Stack>
  )
}

export default Chat