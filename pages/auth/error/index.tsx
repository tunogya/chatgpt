import {Button, Stack, Text, useColorModeValue} from "@chakra-ui/react";
import {useRouter} from "next/router";

const Error = () => {
  const router = useRouter()
  const {error} = router.query
  const bg = useColorModeValue('white', '#343541')
  const fontColor = useColorModeValue('black', '#ECECF1')

  return (
    <Stack h={'100vh'} w={'full'} bg={bg} align={"center"} justify={"center"}>
      <Text fontSize={'sm'} color={fontColor}>Error</Text>
      <Text fontSize={'sm'} color={fontColor}>Oops! {error}</Text>
      <Button color={fontColor} onClick={() => router.back()}>Go back</Button>
    </Stack>
  )
}

export default Error