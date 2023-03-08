import MobileNavigationBar from "@/components/NavigationBar/MobileNavigationBar";
import DialogBoxList from "@/components/DialogBoxList";
import InputArea from "@/components/Content/InputArea";

const Content = () => {
  return (
    <div className="flex h-full flex-1 flex-col md:pl-[260px]">
      <MobileNavigationBar/>
      <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="react-scroll-to-bottom--css-minru-79elbk h-full dark:bg-gray-800">
            <div className="react-scroll-to-bottom--css-minru-1n7m0yu">
              <DialogBoxList/>
            </div>
          </div>
        </div>
        <InputArea />
      </main>
    </div>
  )
}

export default Content