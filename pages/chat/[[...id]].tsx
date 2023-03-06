import Content from "@/components/Content";
import MobileSideBar from "@/components/NavigationBar/MobileSideBar";
import PCNavigation from "@/components/NavigationBar/PCNavigation";

const Chat = () => {
  return (
    <>
      <div className={'overflow-hidden w-full h-full relative'}>
        <PCNavigation/>
        <Content/>
      </div>
      <MobileSideBar/>
    </>
  )
}

export default Chat