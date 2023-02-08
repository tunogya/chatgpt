import {HStack, Stack, Text} from "@chakra-ui/react";

const Login = () => {
  return (
    <Stack>
      <Text>
        Welcome to ChatGPT
        Log in with your account to continue
      </Text>
      <HStack>
        <Text>Login in</Text>
        <Text>Sign up</Text>
      </HStack>
    </Stack>
  )
}

export default Login