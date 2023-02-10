import {
  Button,
  HStack, Input, InputGroup, Modal,
  ModalBody, ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text, useDisclosure
} from "@chakra-ui/react";
import {useState} from "react";

const Login = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Stack h={'100vh'} w={'full'} justify={"center"} align={"center"} spacing={3}>
      <Text textAlign={"center"} fontSize={'sm'}>
        Welcome to ChatGPT via WizardingPay<br/>
        Log in with your account to continue
      </Text>
      <HStack spacing={3}>
        <Button onClick={() => {
          setIsLogin(true)
          onOpen()
        }}>Login in</Button>
        <Button onClick={() => {
          setIsLogin(false)
          onOpen()
        }}>Sign up</Button>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{ isLogin ? 'Login in' : 'Sign up' }</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <InputGroup variant={'outline'}>
                <Input placeholder={'Username'}/>
              </InputGroup>
              <InputGroup variant={'outline'}>
                <Input placeholder={'Password'}/>
              </InputGroup>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button>Sure</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}

export default Login