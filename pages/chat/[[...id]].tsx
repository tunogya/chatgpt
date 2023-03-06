import {useRouter} from "next/router";
import NavigationBar from "@/components/NavigationBar";
import Content from "@/components/Content";

const Chat = () => {
  const router = useRouter()
  const conversation_id = router.query?.id?.[0] as string

  return (
    <div className={'overflow-hidden w-full h-full relative'}>
      <NavigationBar/>
      <Content/>
    </div>
  )
}

export default Chat