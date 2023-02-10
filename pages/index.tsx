import {Stack, Text} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useEffect} from "react";

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/auth/login")
  }, [router])

  return (
    <Stack p={2}>
      <Text>This is ChatGPT via WizardingPay Website</Text>
    </Stack>
  )
}

export default Index