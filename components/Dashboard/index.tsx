import {useDispatch} from "react-redux";
import {setInput} from "@/store/ui";
import {useState} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useUser()
  const [demo, setDemo] = useState([
    '用简单的术语解释量子计算', ' 10岁生日排队有哪些有趣的安排？', '如何在Javascript中发出HTTP请求？'
  ])

  return (
    <div className="flex flex-col items-center text-sm dark:bg-gray-800">
      <div
        className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
        <h1
          className="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">
          abandon.chat
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
              为你推荐
            </h2>
            {/*TODO: 使用推荐算法生成一些用例*/}
            <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
              {
                demo.map((item, index) => (
                  <button
                    key={index}
                    className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                    onClick={() => {
                      dispatch(setInput(item))
                    }}
                  >
                    {item} →
                  </button>
                ))
              }
            </ul>
          </div>
          <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
            <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" aria-hidden="true" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path>
              </svg>
              每日福利
            </h2>
            <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
              <button
                className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                onClick={() => {
                }}
              >
                本周使用 2 天，<br/>领取 2 天体验卡 →
              </button>
              <button
                className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                onClick={() => {
                }}
              >
                周一免费使用 →
              </button>
              <button
                className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                onClick={() => {
                }}
              >
                邀请朋友得体验卡 →
              </button>
            </ul>
          </div>
          <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
            <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
              {
                user?.picture && (
                  <div className={'h-6 w-6 overflow-hidden rounded-full'}>
                    <img src={user.picture} alt={user?.name || 'user'} width={'24px'} height={'24px'}/>
                  </div>
                )
              }
              {user ? user.name : '请登录'}
            </h2>
            <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">账户</li>
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">付费会员卡</li>
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">免费体验卡</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
    </div>
  )
}

export default Dashboard