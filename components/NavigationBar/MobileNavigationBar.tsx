import {useDispatch} from "react-redux";
import {setIsOpenSidebar} from "@/store/ui";
import AddIcon from "@/components/SVG/AddIcon";
import MenuIcon from "@/components/SVG/MenuIcon";
import {clearSession} from "@/store/session";
import {useRouter} from "next/router";

const MobileNavigationBar = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  return (
    <div
      className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
      <button type="button" onClick={() => dispatch(setIsOpenSidebar(true))}
              className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white">
        <span className="sr-only">打开侧边栏</span>
        <MenuIcon/>
      </button>
      <h1 className="flex-1 text-center text-base font-normal">新会话</h1>
      <button type="button" className="px-3"
              onClick={async () => {
                await dispatch(clearSession());
                await router.push({
                  pathname: `/chat`,
                })
              }}>
        <AddIcon/>
      </button>
    </div>
  )
}

export default MobileNavigationBar