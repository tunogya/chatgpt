import {
  Stack,
  useMediaQuery,
} from '@chakra-ui/react';
import MenuMobile from "@/_components/MenuMobile";
import Menu from "@/_components/Menu";
import Conversation from "@/_components/Conversation";
import {useRouter} from "next/router";

const Chat = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const router = useRouter()
  const conversation_id = router.query?.id?.[0] as string

  return (
    <Stack direction={['column', 'column', 'row']} h={'full'} w={'full'} spacing={0}>
      {isMobile ? <MenuMobile/> : <Menu/>}
      <Conversation conversation_id={conversation_id} />
    </Stack>
  )
}

export default Chat