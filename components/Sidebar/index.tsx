import DeleteIcon from "@/components/SVG/DeleteIcon";
import LogoutIcon from "@/components/SVG/LogoutIcon";
import AddIcon from "@/components/SVG/AddIcon";
import CloseIcon from '@/components/SVG/CloseIcon'
import ConversationsList from "@/components/ConversationsList";

const Sidebar = () => {
  return (
    <div id="headlessui-portal-root" hidden={true}>
      <div data-headlessui-portal="">
        <div className="relative z-40 md:hidden" id="headlessui-dialog-:r4:" role="dialog" aria-modal="true"
             data-headlessui-state="open">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 opacity-100"></div>
          <div className="fixed inset-0 z-40 flex">
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 translate-x-0"
                 id="headlessui-dialog-panel-:r5:" data-headlessui-state="open">
              <div className="absolute top-0 right-0 -mr-12 pt-2 opacity-100">
                <button type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        tabIndex={0}><span className="sr-only">关闭侧边栏</span>
                  <CloseIcon/>
                </button>
              </div>
              <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                  <a
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20">
                    <AddIcon/>
                    新会话
                  </a>
                  <ConversationsList/>
                  <a
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <DeleteIcon/>
                    清空会话</a>
                  <a
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <LogoutIcon/>
                    退出登陆
                  </a>
                </nav>
              </div>
            </div>
            <div className="w-14 flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar