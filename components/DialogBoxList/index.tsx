import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setIsWaitHistory, setSession} from "@/store/session";
import DialogBoxItem from "@/components/DialogBoxList/DialogBoxItem";
import {useRouter} from "next/router";
import DownIcon from "@/components/SVG/DownIcon";
import ScrollToBottom, {useScrollToBottom, useSticky} from "react-scroll-to-bottom";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import dynamic from 'next/dynamic';
import useSWR from "swr";
import LightingIcon from "@/components/SVG/LightingIcon";

const DialogBoxListContent = () => {
  const bottomRef = useRef(null);
  const session = useSelector((state: any) => state.session.session);
  const dispatch = useDispatch();
  const router = useRouter();
  const isWaitHistory = useSelector((state: any) => state.session.isWaitHistory);
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();
  const conversation_id = router.query.id?.[0] || undefined;
  const {
    data,
    isLoading
  } = useSWR(conversation_id ? `/api/conversation/${conversation_id}` : null, (url: string) => fetch(url).then((res) => res.json()))

  const updateSession = useCallback(async () => {
    if (data) {
      dispatch(setSession({
        // @ts-ignore
        id: data.SK,
        // @ts-ignore
        title: data.title,
        // @ts-ignore
        mapping: data.mapping,
        // @ts-ignore
        create_time: new Date(data.created * 1000).toLocaleString(),
      }))
    }
    dispatch(setIsWaitHistory(isLoading))
  }, [data, dispatch, isLoading])

  useEffect(() => {
    updateSession()
  }, [updateSession])

  // scroll to bottom when new message
  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [session.messages]);

  const rootMessageId = useMemo(() => {
    if (!session) {
      return null
    }
    if (session.mapping?.['00000000-0000-0000-0000-000000000000']) {
      return '00000000-0000-0000-0000-000000000000'
    }
    // for those who has no root(00000000-0000-0000-0000-000000000000) message
    const ids = Object?.keys(session?.mapping || {}) || []
    if (ids.length === 0) {
      return null
    }
    let check_point = ids[0]
    while (session.mapping[check_point].parent !== null) {
      check_point = session.mapping[check_point].parent
    }
    return check_point
  }, [session])

  return (
    <div className={"w-full"}>
      <div className="flex flex-col items-center text-sm dark:bg-gray-800">
        {
          isWaitHistory ? (
            <div className="flex flex-col items-center text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-800">
              <div className={"pt-4"}>
                <LoadingIcon/>
              </div>
              <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
            </div>
          ) : (
            // if session.id is not null, can show dialog box
            // if session id is null, but rootMessageId has value, can show dialog box
            // if session id is null, and rootMessageId is null, too, show placeholder
            (session?.id || rootMessageId)
              ? (
                rootMessageId && (
                  <DialogBoxItem id={rootMessageId}/>
                )
              ) : (
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
                          快速入门
                        </h2>
                        <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                          <a href={'https://www.explainthis.io/zh-hans/chatgpt/start'} rel={'noreferrer'} target={'_blank'}
                             className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">应用和教学 →
                          </a>
                          <a href={'https://www.explainthis.io/zh-hans/chatgpt'} rel={'noreferrer'} target={'_blank'}
                            className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">ChatGPT 指令大全 →
                          </a>
                          <a href={'https://promptperfect.jina.ai'} rel={'noreferrer'} target={'_blank'}
                             className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">优化提示词 Prompt →
                          </a>
                        </ul>
                      </div>
                      <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                        <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                          <LightingIcon/>
                          能力
                        </h2>
                        <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                          <li
                            className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">记住用户早些时候在对话中说的话
                          </li>
                          <li
                            className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">允许用户提供后续更正
                          </li>
                          <li
                            className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">接受过拒绝不当请求的培训
                          </li>
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
                    </div>
                  </div>
                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                </div>
              )
          )
        }
      </div>
      {
        !sticky && (
          <button onClick={scrollToBottom} id={"scroll-to-bottom-button"}
                  className="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
            <DownIcon/>
          </button>
        )
      }
    </div>
  )
}

const WrapDialogBoxListContent = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollToBottom className="h-full w-full dark:bg-gray-800">
        <DialogBoxListContent/>
      </ScrollToBottom>
    </div>
  )
}

export default dynamic(() => Promise.resolve(WrapDialogBoxListContent), {
  ssr: false
})
