import {useRouter} from "next/router";

const Chat = () => {
  const router = useRouter()
  const conversation_id = router.query?.id?.[0] as string

  return (
    <div>

    </div>
  )
}

export default Chat