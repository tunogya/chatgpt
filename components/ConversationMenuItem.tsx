import {Box, HStack, IconButton, Text} from "@chakra-ui/react";
import {IoChatboxOutline} from "react-icons/io5";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {router} from "next/client";
import {FC, useState} from "react";
import {useSelector} from "react-redux";

type ConversationMenuItemProps = {
  item: {
    id: string,
    title: string,
  }
}

const ConversationMenuItem: FC<ConversationMenuItemProps> = ({item}) => {
  const session = useSelector((state: any) => state.session.session);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <HStack minH={'40px'} p={3} cursor={'pointer'} bg={item.id === session?.id ? 'bg2' : 'bg1'}
            _hover={{bg: 'bg3'}} borderRadius={'0.375rem'} maxH={'44px'}
            onClick={() => {
              router.push({
                pathname: `/chat/${item.id.split('#').pop()}`,
              })
            }}
    >
      <Box>
        <IoChatboxOutline size={'16px'} color={'white'}/>
      </Box>
      <Text color={'gray.50'} textAlign={'start'} w={'full'} overflow={'hidden'} textOverflow={'ellipsis'}
            whiteSpace={'nowrap'} fontSize={'sm'}>
        {item.title}
      </Text>
      {
        item.id === session?.id && (
          <>
            { deleteConfirm ? (
              <HStack spacing={0}>
                <IconButton aria-label={'yes'} icon={<EditIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={() => {
                              // delete conversation
                            }}
                />
                <IconButton aria-label={'no'} icon={<DeleteIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={() => {
                              setDeleteConfirm(false);
                            }}
                />
              </HStack>
            ) : (
              <HStack spacing={0}>
                <IconButton aria-label={'edit'} icon={<EditIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'} />
                <IconButton aria-label={'delete'} icon={<DeleteIcon/>} color={'gray.50'} size={'xs'} variant={'ghost'}
                            onClick={() => {
                              setDeleteConfirm(true);
                            }}
                />
              </HStack>
            ) }
          </>
        )
      }
    </HStack>
  )
}

export default ConversationMenuItem;