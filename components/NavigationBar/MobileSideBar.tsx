import CloseIcon from '@/components/SVG/CloseIcon'
import NavigationBar from "@/components/NavigationBar/index";
import {useDispatch, useSelector} from "react-redux";
import {setIsOpenSidebar} from "@/store/ui";

const MobileSidebar = () => {
  const isOpenSidebar = useSelector((state: any) => state.ui.isOpenSidebar)
  const dispatch = useDispatch();

  return (
    <div id="headlessui-portal-root" hidden={!isOpenSidebar}>
      <div data-headlessui-portal="">
        <div className="relative z-40 md:hidden" id="headlessui-dialog-:r4:" role="dialog" aria-modal="true"
             data-headlessui-state="open">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 opacity-100"></div>
          <div className="fixed inset-0 z-40 flex">
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 translate-x-0"
                 id="headlessui-dialog-panel-:r5:" data-headlessui-state="open">
              <div className="absolute top-0 right-0 -mr-12 pt-2 opacity-100">
                <button type="button" onClick={() => dispatch(setIsOpenSidebar(false))} tabIndex={0}
                        className="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">关闭侧边栏</span>
                  <CloseIcon/>
                </button>
              </div>
              <NavigationBar/>
            </div>
            <div className="w-14 flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileSidebar