import {useDispatch} from "react-redux";
import {setInput} from "@/store/ui";
import {useState} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";
import Image from "next/image";

const Dashboard = () => {
  const dispatch = useDispatch()
  const {user} = useUser()
  const [demo, setDemo] = useState([
    '用简单的术语解释量子计算', ' 10 岁生日派对有哪些有趣的安排？', '如何在 Javascript 中发出 HTTP 请求？'
  ])

  return (
    <div className="flex flex-col items-center text-sm dark:bg-gray-800">
      <div
        className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
        <h1
          className="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">
          ChatGPT
        </h1>
        <div className="md:flex items-start text-center gap-3.5">
          <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
            <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
              <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
                   strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" height="1em" width="1em"
                   xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              推荐
            </h2>
            <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
              {
                demo.map((item, index) => (
                  <button
                    key={index}
                    className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                    onClick={() => {
                      dispatch(setInput(item))
                      // @ts-ignore
                      window.gtag('event', 'custom_button_click', {
                        'event_category': '按钮',
                        'event_label': '点击推荐案例',
                        'value': item,
                      })
                    }}
                  >
                    &quot;{item}&quot; →
                  </button>
                ))
              }
            </ul>
          </div>
          <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
            <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
              <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
                   strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" height="1em" width="1em"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              限制
            </h2>
            <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
              <li
                className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">可能偶尔会产生不正确的信息
              </li>
              <li
                className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">可能偶尔会产生有害的指令或有偏见的内容
              </li>
              <li
                className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">对 2021 年后的世界和事件的了解有限
              </li>
            </ul>
          </div>
          <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
            <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
              <div className={'h-6 w-6 overflow-hidden rounded-full'}>
                {
                  user?.picture && (
                    <Image src={user?.picture || ""} alt={user?.name || "avatar"} width={24} height={24} quality={80}
                           blurDataURL={`https://dummyimage.com/24x24/ffffff/000000.png&text=${user?.name?.[0] || 'A'}`}
                           priority/>
                  )}
              </div>
              账户
            </h2>
          </div>
        </div>
      </div>
      <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
    </div>
  )
}

export default Dashboard