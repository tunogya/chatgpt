import {FC, useEffect, useMemo, useRef} from "react";
import DialogBoxItem from "@/components/DialogBoxList/DialogBoxItem";
import DownIcon from "@/components/SVG/DownIcon";
import {useScrollToBottom, useSticky} from "react-scroll-to-bottom";
import Typewriter from "@/components/Typewriter";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import {useDispatch, useSelector} from "react-redux";
import {setModel} from "@/store/session";

type DialogBoxListContentProps = {
  data: any
  isLoading: boolean
  gpt3_5: boolean
  gpt4: boolean
}

const DialogBoxList: FC<DialogBoxListContentProps> = ({data, isLoading, gpt3_5, gpt4}: any) => {
  const bottomRef = useRef(null);
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();
  const model = useSelector((state: any) => state.session.model);
  const dispatch = useDispatch();

  // scroll to bottom when new message
  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [data.messages]);

  const rootMessageId = useMemo(() => {
    if (!data) {
      return null
    }
    if (data.mapping?.['00000000-0000-0000-0000-000000000000']) {
      return '00000000-0000-0000-0000-000000000000'
    }
    // for those who has no root(00000000-0000-0000-0000-000000000000) message
    const ids = Object?.keys(data?.mapping || {}) || []
    if (ids.length === 0) {
      return null
    }
    let check_point = ids[0]
    while (data.mapping[check_point].parent !== null) {
      check_point = data.mapping[check_point].parent
    }
    return check_point
  }, [data])

  return (
    <div className={"w-full h-full"}>
      <div className="flex flex-col h-full items-center text-sm dark:bg-gray-800">
        {
          isLoading ? (
            <div className="flex flex-col items-center text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-800">
              <div className={"pt-4"}>
                <LoadingIcon/>
              </div>
              <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
            </div>
          ) : (
            (data?.id || rootMessageId)
              ? (
                rootMessageId && (
                  <>
                    <header className="w-full">
                      <div
                        className="relative z-20 flex min-h-[60px] flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-white p-2 text-gray-500 dark:border-gray-900/50 dark:bg-gray-800 dark:text-gray-300">
                        <div
                          className="flex flex-1 flex-grow items-center gap-1 p-1 text-gray-600 dark:text-gray-200 justify-center sm:p-0">
                          {
                            model === 'gpt-3.5-turbo' && (
                              <span>Default (GPT-3.5)</span>
                            )
                          }
                          {
                            model === 'gpt-4' && (
                              <span>Model (GPT-4)</span>
                            )
                          }
                        </div>
                      </div>
                    </header>
                    <DialogBoxItem id={rootMessageId} data={data}/>
                  </>
                )
              ) : (
                <>
                  <div className="px-2 w-full flex flex-col py-2 md:py-6 sticky top-0">
                    <div className="relative flex flex-col items-stretch justify-center gap-2 sm:items-center">
                      <div className="relative flex rounded-xl bg-gray-100 p-1 text-gray-900 dark:bg-gray-900">
                        <ul className="flex w-full list-none gap-1 sm:w-auto">
                          <li className="group/toggle w-full">
                            <button type="button" className="w-full cursor-pointer" onClick={() => {
                              dispatch(setModel('gpt-3.5-turbo'))
                            }}>
                              <div
                                className={`group/button relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5 ${model === 'gpt-3.5-turbo' ? 'border-black/10 bg-white text-gray-900 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] hover:!opacity-100 dark:border-[#4E4F60] dark:bg-gray-700 dark:text-gray-100' : 'border-transparent text-gray-500 hover:text-gray-800 hover:dark:text-gray-100'}`}>
                                <span className="relative max-[370px]:hidden">
                                  <svg xmlns="http://www.w3.org/2000/svg"
                                       viewBox="0 0 16 16" fill="none"
                                       className={`h-4 w-4 transition-colors ${model === 'gpt-3.5-turbo' ? 'text-brand-green' : ''} group-hover/button:text-brand-green`}
                                       width="16" height="16"
                                       strokeWidth="2"><path
                                    d="M9.586 1.526A.6.6 0 0 0 8.553 1l-6.8 7.6a.6.6 0 0 0 .447 1h5.258l-1.044 4.874A.6.6 0 0 0 7.447 15l6.8-7.6a.6.6 0 0 0-.447-1H8.542l1.044-4.874Z"
                                    fill="currentColor"></path>
                                  </svg>
                                </span>
                                <span className="truncate text-sm font-medium md:pr-1.5 pr-1.5">GPT-3.5</span>
                                {
                                  !gpt3_5 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         aria-hidden="true" strokeWidth="2"
                                         className="h-4 w-4 ml-0.5 transition-colors sm:ml-0 group-hover/options:text-gray-500 !text-gray-500 -ml-2 group-hover/button:text-brand-purple">
                                      <path fillRule="evenodd"
                                            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                            clipRule="evenodd"></path>
                                    </svg>
                                  )
                                }
                              </div>
                            </button>
                          </li>
                          <li className="group/toggle w-full">
                            <button type="button" className="w-full cursor-pointer" onClick={() => {
                              if (gpt4) {
                                dispatch(setModel('gpt-4'))
                              }
                            }} disabled={!gpt4}>
                              <div
                                className={`group/button relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5 ${model === 'gpt-3.5-turbo' ? 'border-transparent text-gray-500 hover:text-gray-800 hover:dark:text-gray-100' : 'border-black/10 bg-white text-gray-900 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] hover:!opacity-100 dark:border-[#4E4F60] dark:bg-gray-700 dark:text-gray-100'}`}>
                                <span className="relative max-[370px]:hidden">
                                  <svg xmlns="http://www.w3.org/2000/svg"
                                       viewBox="0 0 16 16" fill="none"
                                       className={`h-4 w-4 transition-colors ${model === 'gpt-4' ? 'text-brand-purple' : ''} group-hover/button:text-brand-purple`}
                                       width="16" height="16"
                                       strokeWidth="2"><path
                                    d="M12.784 1.442a.8.8 0 0 0-1.569 0l-.191.953a.8.8 0 0 1-.628.628l-.953.19a.8.8 0 0 0 0 1.57l.953.19a.8.8 0 0 1 .628.629l.19.953a.8.8 0 0 0 1.57 0l.19-.953a.8.8 0 0 1 .629-.628l.953-.19a.8.8 0 0 0 0-1.57l-.953-.19a.8.8 0 0 1-.628-.629l-.19-.953h-.002ZM5.559 4.546a.8.8 0 0 0-1.519 0l-.546 1.64a.8.8 0 0 1-.507.507l-1.64.546a.8.8 0 0 0 0 1.519l1.64.547a.8.8 0 0 1 .507.505l.546 1.641a.8.8 0 0 0 1.519 0l.546-1.64a.8.8 0 0 1 .506-.507l1.641-.546a.8.8 0 0 0 0-1.519l-1.64-.546a.8.8 0 0 1-.507-.506L5.56 4.546Zm5.6 6.4a.8.8 0 0 0-1.519 0l-.147.44a.8.8 0 0 1-.505.507l-.441.146a.8.8 0 0 0 0 1.519l.44.146a.8.8 0 0 1 .507.506l.146.441a.8.8 0 0 0 1.519 0l.147-.44a.8.8 0 0 1 .506-.507l.44-.146a.8.8 0 0 0 0-1.519l-.44-.147a.8.8 0 0 1-.507-.505l-.146-.441Z"
                                    fill="currentColor"></path>
                                  </svg>
                                </span>
                                <span className="truncate text-sm font-medium md:pr-1.5 pr-1.5">GPT-4</span>
                                {
                                  !gpt4 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         aria-hidden="true" strokeWidth="2"
                                         className="h-4 w-4 ml-0.5 transition-colors sm:ml-0 group-hover/options:text-gray-500 !text-gray-500 -ml-2 group-hover/button:text-brand-purple">
                                      <path fillRule="evenodd"
                                            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                            clipRule="evenodd"></path>
                                    </svg>
                                  )
                                }
                              </div>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-sm dark:bg-gray-800 h-full w-full">
                    <h1
                      className="text-4xl font-semibold text-center text-gray-800 dark:text-gray-100">
                      <Typewriter text={'ChatGPT'}/>
                    </h1>
                    <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                  </div>
                </>
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

export default DialogBoxList