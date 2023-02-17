import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Modal, ModalBody, ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay, useColorModeValue, useMediaQuery
} from "@chakra-ui/react";
import passBody from "@/components/PassBody";
import PassBody from "@/components/PassBody";
import {FC} from "react";

type Props = {
  isOpen: boolean
  onClose: () => void
}

const PassModalAndDrawer: FC<Props> = ({isOpen, onClose}) => {
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const [isMobile] = useMediaQuery('(max-width: 768px)') // init is false

  if (isMobile) {
    return (
      <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
        <DrawerContent borderTopRadius={'20px'} overflow={'hidden'}>
          <DrawerHeader color={fontColor} px={[3, 4]}>Recharge Pass</DrawerHeader>
          <DrawerBody pt={0} pb={3} px={[3, 4]}>
            {passBody()}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  } else {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={['xs', 'sm', 'md']}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader color={fontColor} px={[3, 4]}>Recharge Pass</ModalHeader>
          <ModalCloseButton color={fontColor}/>
          <ModalBody pt={0} pb={3} px={[3, 4]}>
            {PassBody()}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }
}

export default PassModalAndDrawer