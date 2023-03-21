import Content from "@/components/Content";
import MobileSideBar from "@/components/NavigationBar/MobileSideBar";
import PCNavigation from "@/components/NavigationBar/PCNavigation";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

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

export const getServerSideProps = withPageAuthRequired();

export default Chat;