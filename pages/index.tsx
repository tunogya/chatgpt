import {Stack, Text} from "@chakra-ui/react";
import {useEffect} from "react";
import {useRouter} from "next/router";

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/chat")
  }, [router])

  return (
    <Stack p={2}>
      <Text>Chat</Text>
    </Stack>
  )
}

export default Index