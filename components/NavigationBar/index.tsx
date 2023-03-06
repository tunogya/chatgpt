import AddIcon from "@/components/SVG/AddIcon";
import LogoutIcon from "@/components/SVG/LogoutIcon";
import SunIcon from "@/components/SVG/SunIcon";
import DeleteIcon from "@/components/SVG/DeleteIcon";
import ConversationsList from "@/components/ConversationsList";

const NavigationBar = () => {
  return (
    <div className={'dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col'}>
      <div className={'flex h-full min-h-0 flex-col '}>
        <div className={'scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20'}>
          <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
            <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors
            duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20">
              <AddIcon/>
              新会话
            </a>
            <ConversationsList/>
            <a
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors
              duration-200 text-white cursor-pointer text-sm">
              <DeleteIcon/>
              清空对话</a>
            <a
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors
              duration-200 text-white cursor-pointer text-sm">
              <SunIcon/>
              深色模式</a>
            <a
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors
              duration-200 text-white cursor-pointer text-sm">
              <LogoutIcon/>
              退出登陆
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavigationBar