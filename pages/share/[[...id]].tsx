import {useRouter} from "next/router";
import useSWR from "swr";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import OpenShareDialogBoxList from "@/components/OpenShareDialogBoxList";

const Share = () => {
  const router = useRouter();
  const shared_conversation_id = router.query.id?.[0] || undefined;
  const {
    data,
    isLoading,
  } = useSWR(shared_conversation_id ? `/api/share/${shared_conversation_id}` : null,
    (url) => fetch(url).then(res => res.json()));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-800">
        <div className={"pt-4"}>
          <LoadingIcon/>
        </div>
        <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden w-full h-full relative flex z-0">
      <div className="relative flex h-full max-w-full flex-1 overflow-hidden">
        <div className="flex h-full max-w-full flex-1 flex-col">
          <main
            className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-auto dark:bg-gray-800">
                <div className="flex flex-col text-sm dark:bg-gray-800">
                  <div
                    className="flex items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300 sticky top-0 z-50">
                    <span>分享对话</span><span className="px-1">•</span>模型: gpt-3.5
                  </div>
                  <div className="mx-auto w-full p-4 md:max-w-2xl lg:max-w-xl lg:px-0 xl:max-w-3xl">
                    <div className="mb-1 border-b border-gray-100 pt-3 sm:mb-2 sm:pb-10 sm:pt-8">
                      <h1
                        className="max-w-md text-3xl font-semibold leading-tight text-gray-700 dark:text-gray-100 sm:text-4xl">
                        {data?.title}
                      </h1>
                      <div
                        className="pt-3 text-base text-gray-400 sm:pt-4">{data?.created ? new Date(data?.created * 1000).toDateString() : ''}</div>
                    </div>
                  </div>
                  <OpenShareDialogBoxList data={data} isLoading={isLoading}/>
                  <div className="h-32 md:h-48 flex-shrink-0"></div>
                </div>
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
              {/*<div className="relative flex h-full w-full flex-1 items-center justify-center gap-2">*/}
              {/*  <a target="_self"*/}
              {/*     className="btn relative cursor-pointer btn-primary"*/}
              {/*    // href={data.continue_conversation_url}*/}
              {/*  >*/}
              {/*    <div className="flex w-full gap-2 items-center justify-center">继续该对话</div>*/}
              {/*  </a>*/}
              {/*</div>*/}
              <div
                className="px-3 pb-3 pt-2 text-center text-xs text-gray-600 dark:text-gray-300 md:px-4 md:pb-6 md:pt-3">
                <div className="flex justify-center gap-3 text-gray-500">
                  {/*<button>内容举报</button>*/}
                  {/*<span>|</span>*/}
                  <a href="/doc/term" target="_blank"
                     rel="noreferrer">使用条款</a>
                  <span>|</span>
                  <a
                    href="/doc/privacy" target="_blank"
                    rel="noreferrer">隐私政策</a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Share