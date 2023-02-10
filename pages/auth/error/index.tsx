import {Button, Stack, Text} from "@chakra-ui/react";
import {useRouter} from "next/router";

const Error = () => {
  const router = useRouter()
  const {error} = router.query

  return (
    <Stack h={'100vh'} w={'full'} align={"center"} justify={"center"}>
      <Text fontSize={'sm'}>Error</Text>
      <Text fontSize={'sm'}>Oops! {error}</Text>
      <Button onClick={() => router.back()}>Go back</Button>
    </Stack>
  )
}

export default Error