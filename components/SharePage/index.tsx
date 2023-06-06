import {FC} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";
import OpenShareDialogBoxList from "@/components/SharePage/OpenShareDialogBoxList";
import moment from "moment";

type SharePageProps = {
  data: any
}
const SharePage: FC<SharePageProps> = ({data}) => {
  const {user} = useUser();

  return (
    <div className="relative flex h-full max-w-full flex-1 overflow-hidden">
      <div className="flex h-full max-w-full flex-1 flex-col">
        <main
          className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto dark:bg-gray-800">
              <div className="flex flex-col text-sm dark:bg-gray-800">
                <div
                  className="flex items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300 sticky top-0 z-50">
                  <span>https://abandon.chat</span><span className="px-1">•</span>model: {data?.model || 'default'}
                </div>
                <div className="mx-auto w-full p-4 md:max-w-2xl lg:max-w-xl xl:max-w-3xl">
                  <div className="mb-1 border-b border-gray-100 pt-3 sm:mb-2 sm:pb-10 sm:pt-8">
                    <h1
                      className="max-w-md text-3xl font-semibold leading-tight text-gray-700 dark:text-gray-100 sm:text-4xl">
                      {data?.title}
                    </h1>
                    <div
                      className="pt-3 text-base text-gray-400 sm:pt-4">{`${data.is_anonymous ? '' : `${user?.email}, `}${moment().format('ll')}`}</div>
                  </div>
                </div>
                <OpenShareDialogBoxList data={data}/>
                <div className="h-32 md:h-48 flex-shrink-0"></div>
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
            <div
              className="px-3 pb-3 pt-2 text-center text-xs text-gray-600 dark:text-gray-300 md:px-4 md:pb-6 md:pt-3">
              <div className="flex justify-center gap-3 text-gray-500">
                <p>
                  © {new Date().getFullYear()}, Abandon Inc., Powered by OpenAI.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SharePage