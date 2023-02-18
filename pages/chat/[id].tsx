import {
  Stack,
  useMediaQuery,
} from '@chakra-ui/react';
import MenuMobile from "@/components/MenuMobile";
import Menu from "@/components/Menu";
import Conversation from "@/components/Conversation";
import {useRouter} from "next/router";

const Chat = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const router = useRouter()
  const conversation_id = router.query.id as string

  return (
    <Stack direction={['column', 'column', 'row']} h={'full'} w={'full'} spacing={0}>
      {isMobile ? <MenuMobile/> : <Menu/>}
      <Conversation conversation_id={conversation_id} />
    </Stack>
  )
}

export default Chat