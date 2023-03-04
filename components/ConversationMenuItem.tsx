import {Box, HStack, IconButton, Text} from "@chakra-ui/react";
import {ChatIcon, CheckIcon, CloseIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";
import {FC, useState} from "react";
import {useSelector} from "react-redux";

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
  const jwt = useSelector((state: any) => state.user.token);
  const [title, setTitle] = useState(item.title);
  const router = useRouter();

  const deleteConversation = async () => {
    await fetch(`/api/conversation/${item.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      }
    })
  }

  const updateConversationTitle = async () => {
    if (!title) {
      return
    }
    await fetch(`/api/conversation/${item.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        title: title,
      })
    })
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
      <Text color={'gray.50'} textAlign={'start'} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
            fontWeight={'500'}
            whiteSpace={'nowrap'} fontSize={'sm'}>
        {item.title}
      </Text>
      {
        item.id.split('#').pop() === router.query.id && item.id === session.id && (
          <>
            {deleteConfirm && (
              <HStack spacing={0}>
                <IconButton aria-label={'yes'} icon={<CheckIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={deleteConversation}
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
                            onClick={updateConversationTitle}
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
                            onClick={() => {
                              setUpdateConfirm(true);
                            }}
                />
                <IconButton aria-label={'delete'} icon={<DeleteIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={() => {
                              setDeleteConfirm(true);
                            }}
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