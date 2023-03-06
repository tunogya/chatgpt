import {useRouter} from "next/router";
import NaviBar from "@/components/NaviBar";
import Content from "@/components/Content";

const Chat = () => {
  const router = useRouter()
  const conversation_id = router.query?.id?.[0] as string

  return (
    <div className={'overflow-hidden w-full h-full relative'}>
      <NaviBar/>
      <Content/>
    </div>
  )
}

export default Chat