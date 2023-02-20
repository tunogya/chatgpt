import {
  Box,
  Button,
  Spacer,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import {FiLogOut, FiPlus, FiTrash2} from "react-icons/fi";
import {IoChatboxOutline} from "react-icons/io5";
import {RiVipCrown2Line} from "react-icons/ri";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import {
  clearSession,
  logout,
  setConversation,
  setPhotoUrl,
  setPriorityPass,
  setToken,
  setUsername
} from "@/store/user";
import PassModalAndDrawer from "@/components/PassModalAndDrawer";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";

const Menu = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const router = useRouter()
  const {isOpen: isOpenPass, onOpen: onOpenPass, onClose: onClosePass} = useDisclosure()
  const dispatch = useDispatch();
  const jwt = useSelector((state: any) => state.user.token);
  const session = useSelector((state: any) => state.user.session);
  const conversation = useSelector((state: any) => state.user.conversation);
  const [isWaitClear, setIsWaitClear] = useState(false);

  const clearConversationList = async () => {
    if (conversation && conversation.length) {
      setIsWaitClear(true);
      const response = await fetch('/api/conversation', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            ids: conversation.map((c: any) => c.id),
          })
        }
      );
      if (!response.ok) {
        return
      }
      await getConversationHistory()
    }
    dispatch(clearSession())
    setIsWaitClear(false);
    await router.push({
      pathname: `/chat`,
    })
  }

  const getConversationHistory = useCallback(async () => {
    const response = await fetch('/api/conversation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    dispatch(setConversation(data.items || []));
  }, [jwt]);

  const getUserSession = useCallback(async () => {
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    dispatch(setToken(data.token));
    dispatch(setPriorityPass(data.priority_pass));
    dispatch(setUsername(data.username));
    dispatch(setPhotoUrl(data.photo_url));
  }, [jwt])

  useEffect(() => {
    getUserSession()
  }, [getUserSession])

  useEffect(() => {
    if (session?.id) {
      getConversationHistory()
    }
  }, [session, getConversationHistory])

  return (
    <Stack h={'full'} p={2} spacing={2} bg={'bg1'} minW={'260px'} w={['full', 'full', '260px']}>
      <Button variant={'outline'} boxShadow={'md'} minH={'46px'} borderColor={'whiteAlpha.400'} _hover={{bg: 'bg3'}}
              leftIcon={<FiPlus color={'white'}/>} justifyContent={"start"} gap={1} color={"white"}
              onClick={() => {
                dispatch(clearSession());
                router.push({
                  pathname: `/chat`,
                })
              }}>
        New chat
      </Button>
      <Stack pt={2} h={'full'} overflow={"scroll"}>
        {conversation && conversation?.map((item: any) => (
          <Button key={item.id} variant={'ghost'} leftIcon={<IoChatboxOutline color={'white'}/>} gap={1}
                  _hover={{bg: 'bg3'}}
                  onClick={() => {
                    router.push({
                      pathname: `/chat/${item.id.split('#').pop()}`,
                    })
                  }}
          >
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
        <Button variant={'ghost'} leftIcon={<FiTrash2 color={'white'}/>} gap={1} justifyContent={"start"} isLoading={isWaitClear} loadingText={'Clearing...'}
                color={'white'} _hover={{bg: 'bg3'}} onClick={clearConversationList}>
          Clear conversations
        </Button>
        <Button variant={'ghost'} leftIcon={<RiVipCrown2Line color={'gold'}/>} _hover={{bg: 'bg3'}} gap={1} color={'white'}
                justifyContent={"start"} onClick={onOpenPass}>
          Priority Pass
        </Button>
        <PassModalAndDrawer isOpen={isOpenPass} onClose={onClosePass}/>
        <Button variant={'ghost'} gap={1} justifyContent={'start'} color={"white"}
                leftIcon={colorMode === 'light' ? <MoonIcon color={'white'}/> : <SunIcon color={'white'}/>}
                _hover={{bg: 'bg3'}} onClick={toggleColorMode}>
          {colorMode === 'light' ? 'Dark' : 'Light'} mode
        </Button>
        <Button variant={'ghost'} leftIcon={<FiLogOut color={'white'}/>} justifyContent={"start"} gap={1}
                color={'white'} _hover={{bg: 'bg3'}}
                onClick={() => {
                  dispatch(logout())
                  router.push('/auth/login')
                }}>
          Log out
        </Button>
      </Stack>
    </Stack>
  )
}

export default Menu