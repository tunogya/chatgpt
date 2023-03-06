import {Box, HStack, IconButton, Input, Text} from "@chakra-ui/react";
import {ChatIcon, CheckIcon, CloseIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";
import {FC, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteConversation, updateConversationTitle} from "@/store/session";

export type ConversationMenuItemProps = {
  item: {
    id: string,
    title: string,
    create_time: string,
  }
}

const ConversationMenuItem: FC<ConversationMenuItemProps> = ({item}) => {
  const session = useSelector((state: any) => state.session.session);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [updateConfirm, setUpdateConfirm] = useState(false);
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const [title, setTitle] = useState(item.title);
  const router = useRouter();
  const dispatch = useDispatch();

  const deleteConversationItem = async () => {
    try {
      await fetch(`/api/conversation/${item.id.split('#').pop()}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        }
      })
      dispatch(deleteConversation(item.id))
      if (router.query.id === item.id.split('#').pop()) {
        await router.push({
          pathname: `/chat`,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const updateConversationItemTitle = async () => {
    if (!title) {
      return
    }
    try {
      await fetch(`/api/conversation/${item.id.split('#').pop()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title,
        })
      })
      setUpdateConfirm(false)
      dispatch(updateConversationTitle({
        id: item.id,
        title: title,
      }))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <HStack minH={'40px'} p={3} cursor={'pointer'} bg={item.id.split('#').pop() === router.query.id ? 'bg2' : 'bg1'}
            _hover={{bg: 'bg3'}} borderRadius={'0.375rem'} maxH={'44px'}
            onClick={() => {
              router.push({
                pathname: `/chat/${item.id.split('#').pop()}`,
              })
            }}
    >
      <Box>
        {
          deleteConfirm ? (
            <DeleteIcon fontSize={'sm'} color={'white'}/>
          ) : (
            <ChatIcon fontSize={'sm'} color={'white'}/>
          )
        }

      </Box>
      {
        updateConfirm ? (
          <Input defaultValue={title} size={'sm'} height={'24px'} px={0} variant={'outline'} color={'white'}
                 onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <Text color={'gray.50'} textAlign={'start'} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
                fontWeight={'500'} whiteSpace={'nowrap'} fontSize={'sm'}>
            {title}
          </Text>
        )
      }
      {
        item.id.split('#').pop() === router.query.id && item.id === session.id && (
          <>
            {deleteConfirm && (
              <HStack spacing={0}>
                <IconButton aria-label={'yes'} icon={<CheckIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={deleteConversationItem}
                />
                <IconButton aria-label={'no'} icon={<CloseIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={() => {
                              setDeleteConfirm(false);
                            }}
                />
              </HStack>
            )}
            {updateConfirm && (
              <HStack spacing={0}>
                <IconButton aria-label={'yes'} icon={<CheckIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={updateConversationItemTitle}
                />
                <IconButton aria-label={'no'} icon={<CloseIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={() => {
                              setUpdateConfirm(false);
                            }}
                />
              </HStack>
            )}
            {!deleteConfirm && !updateConfirm && (
              <HStack spacing={0}>
                <IconButton aria-label={'edit'} icon={<EditIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={() => setUpdateConfirm(true)}
                />
                <IconButton aria-label={'delete'} icon={<DeleteIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={() => setDeleteConfirm(true)}
                />
              </HStack>
            )}
          </>
        )
      }
    </HStack>
  )
}

export default ConversationMenuItem;