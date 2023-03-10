import {
  Box,
  Button,
  Spacer,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import {AddIcon, CheckIcon, DeleteIcon, MoonIcon, SunIcon, WarningTwoIcon} from "@chakra-ui/icons";
import {
  logout, setAccessToken, setUser
} from "@/store/user";
import {clearSession, setConversation} from "@/store/session";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import ConversationMenuItem from "@/components/ConversationMenuItem";

const Menu = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const router = useRouter()
  const dispatch = useDispatch();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const session = useSelector((state: any) => state.session.session);
  const conversation = useSelector((state: any) => state.session.conversation);
  const [isWaitClear, setIsWaitClear] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const clearConversationList = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return
    }
    setIsWaitClear(true);
    const response = await fetch('/api/conversation', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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
    dispatch(clearSession())
    setIsWaitClear(false);
    setDeleteConfirm(false);
    await router.push({
      pathname: `/chat`,
    })
  }

  const getConversationHistory = async () => {
    const response = await fetch('/api/conversation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    dispatch(setConversation(data.items || []));
  }

  const getUserSession = async () => {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    dispatch(setAccessToken(data.accessToken));
  }

  useEffect(() => {
    getUserSession()
  }, [])

  useEffect(() => {
    getConversationHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id])

  return (
    <Stack h={'full'} p={2} spacing={2} bg={'bg1'} minW={'260px'} w={['full', 'full', '260px']}>
      <Button variant={'outline'} boxShadow={'md'} minH={'46px'} borderColor={'whiteAlpha.400'} _hover={{bg: 'bg3'}}
              leftIcon={<AddIcon color={'white'}/>} justifyContent={"start"} gap={1} color={"white"}
              onClick={async () => {
                await dispatch(clearSession());
                await router.push({
                  pathname: `/chat`,
                })
              }}>
        ?????????
      </Button>
      <Stack pt={1} h={'full'} overflow={"scroll"}>
        {conversation && conversation?.map((item: {
          id: string,
          title: string,
          create_time: string,
        }) => (
          <ConversationMenuItem key={item.id} item={item}/>
        ))}
      </Stack>
      <Spacer/>
      <Stack spacing={1}>
        <Box w={'full'} h={'1px'} bg={'whiteAlpha.400'}/>
        {
          conversation && conversation.length && (
            <Button variant={'ghost'}
                    leftIcon={deleteConfirm ? <CheckIcon color={'white'}/> : <DeleteIcon color={'white'}/>}
                    gap={1} justifyContent={"start"} isLoading={isWaitClear} loadingText={'?????????...'}
                    color={'white'} _hover={{bg: 'bg3'}} onClick={clearConversationList}>
              {deleteConfirm ? '?????????????????????25??????' : '????????????'}
            </Button>
          )
        }
        <Button variant={'ghost'} gap={1} justifyContent={'start'} color={"white"}
                leftIcon={colorMode === 'light' ? <MoonIcon color={'white'}/> : <SunIcon color={'white'}/>}
                _hover={{bg: 'bg3'}} onClick={toggleColorMode}>
          {colorMode === 'light' ? '??????' : '??????'}??????
        </Button>
        <Button variant={'ghost'} leftIcon={<WarningTwoIcon color={'white'}/>} justifyContent={"start"} gap={1}
                color={'white'} _hover={{bg: 'bg3'}}
                onClick={async () => {
                  await dispatch(logout())
                  await router.push('/auth/login')
                }}>
          ??????
        </Button>
      </Stack>
    </Stack>
  )
}

export default Menu