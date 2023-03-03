import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  IconButton,
  Text,
  useColorModeValue, useDisclosure
} from "@chakra-ui/react";
import {AddIcon, HamburgerIcon} from "@chakra-ui/icons";
import Menu from "@/components/Menu";
import {useRouter} from "next/router";
import {clearSession} from "@/store/user";
import {useDispatch} from "react-redux";

const MenuMobile = () => {
  const conversationBg = useColorModeValue('white', 'bg2')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const {isOpen: isOpenMobileMenu, onOpen: onOpenMobileMenu, onClose: onCLoseMobileMenu} = useDisclosure()
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <HStack h={'44px'} w={'full'} position={'absolute'} top={0} left={0} zIndex={'docked'} borderBottom={'1px solid'}
            align={'center'} justify={'space-between'} bg={conversationBg} borderColor={'gray.100'} px={1}
            boxShadow={'sm'}>
      <IconButton aria-label={'menu'} icon={<HamburgerIcon fontSize={'sm'}/>} onClick={onOpenMobileMenu}
                  variant={'ghost'}/>
      <Drawer
        isOpen={isOpenMobileMenu}
        placement='left'
        onClose={onCLoseMobileMenu}
      >
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerCloseButton position={'absolute'} border={'1px solid'} color={fontColor} right={'-40px'}/>
          <Menu />
        </DrawerContent>
      </Drawer>
      <Text color={fontColor} fontSize={'md'} fontWeight={'500'}>新会话</Text>
      <IconButton aria-label={'add'} icon={<AddIcon fontSize={'sm'}/>} variant={'ghost'} onClick={async () => {
        await dispatch(clearSession());
        await router.push({
          pathname: '/chat',
        })
      }}/>
    </HStack>
  )
}

export default MenuMobile