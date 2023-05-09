import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import {setFreeUseTTL, setInput, setIsOpenSidebar, setOffProtected, setPaidUseTTL} from "@/store/ui";
import CloseIcon from "@/components/SVG/CloseIcon";
import {useDispatch, useSelector} from "react-redux";
import {
  clearSession,
  Message,
  setIsWaitComplete,
  updateLastMessageId,
  updateMessageInSession, updateSession
} from "@/store/session";
import AddIcon from "@/components/SVG/AddIcon";
import UserIcon from "@/components/SVG/UserIcon";
import {Dialog, Menu} from "@headlessui/react";
import Image from "next/image";
import MoreIcon from "@/components/SVG/MoreIcon";
import ShareIcon from "@/components/SVG/ShareIcon";
import DeleteIcon from "@/components/SVG/DeleteIcon";
import LogoutIcon from "@/components/SVG/LogoutIcon";
import {useRouter} from "next/router";
import {useEffect, useMemo, useRef, useState} from "react";
import useSWR from "swr";
import DialogBoxList from "@/components/DialogBoxList";
import SendIcon from "@/components/SVG/SendIcon";
import {v4 as uuidv4} from "uuid";
import MenuIcon from "@/components/SVG/MenuIcon";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import DialogMenuItem, {DialogMenuItemProps} from "@/components/DialogMenuItem";

const Chat = ({user}: any) => {
  const isOpenSidebar = useSelector((state: any) => state.ui.isOpenSidebar)
  const dispatch = useDispatch();
  const router = useRouter()
  const [count, setCount] = useState(0);
  const isWaitComplete = useSelector((state: any) => state.session.isWaitComplete);
  const lastMessageId = useSelector((state: any) => state.session.lastMessageId)
  const session = useSelector((state: any) => state.session.session);
  const input = useSelector((state: any) => state.ui.input);
  const off_protected = useSelector((state: any) => state.ui.off_protected);
  const freeUseTTL = useSelector((state: any) => state.ui.freeUseTTL);
  const paidUseTTL = useSelector((state: any) => state.ui.paidUseTTL);
  const inputRef = useRef(null);
  const isWaitHistory = useSelector((state: any) => state.session.isWaitHistory)

  const membershipState = useMemo(() => {
    const freeUseLeft = ((freeUseTTL - Date.now() / 1000) / 86400)
    const paidUseLeft = ((paidUseTTL - Date.now() / 1000) / 86400)
    return freeUseLeft > 0 || paidUseLeft > 0;
  }, [freeUseTTL, paidUseTTL])

  const {data: conversationData, isLoading: isConversationLoading, mutate: mutateConversation} = useSWR('/api/conversation', (url: string) => fetch(url).then((res) => res.json()))

  const handleSubmit = async () => {
    if (input === '') return;
    const scroll_to_bottom_button = document.getElementById('scroll-to-bottom-button');
    if (scroll_to_bottom_button) {
      scroll_to_bottom_button.click();
    }
    const message_id = uuidv4();
    const message: Message = {
      id: message_id,
      author: {
        role: 'user',
        name: user?.name || '',
      },
      role: 'user',
      content: {
        content_type: 'text',
        parts: [input],
      },
    }
    dispatch(updateLastMessageId(message_id));
    dispatch(setInput(''));
    // @ts-ignore
    if (inputRef.current) inputRef.current.style.height = 'auto';
    await complete(message, message_id);
  }

  const complete = async (message: Message, parent: string) => {
    dispatch(setIsWaitComplete(true))
    dispatch(updateMessageInSession({
      message,
      parent: lastMessageId,
    }))
    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          off_protected,
          conversation_id: session.id,
          action: 'next',
          model: 'gpt-3.5-turbo',
          messages: [message],
          parent_message_id: lastMessageId,
        }),
      })
      // @ts-ignore
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let _message = {
        author: {
          role: '',
        },
        content: {
          content_type: '',
          parts: [""],
        },
        id: '',
        role: '',
      };
      // @ts-ignore
      const readChunk = async () => {
        return reader.read().then(({value, done}) => {
          if (!done) {
            const dataString = decoder.decode(value);
            // split data by line, and remove empty line
            const lines = dataString.split('\n\n').filter((line) => line !== '').map((line) => line.trim().replace('data: ', ''));
            for (const line of lines) {
              if (line === "[DONE]") {
                dispatch(setIsWaitComplete(false))
                console.log('[DONE]')
              } else {
                try {
                  const data = JSON.parse(line);
                  // if session.id is null, update session
                  if (!session.id) {
                    dispatch(updateSession({
                      id: data.id,
                      title: data.title,
                    }))
                  }
                  _message = {
                    ..._message,
                    id: data.messages[0].id,
                    role: data.messages[0].author.role,
                    content: {
                      ..._message.content,
                      parts: [
                        _message.content.parts[0] + data.messages[0].content.parts[0]
                      ],
                    },
                    author: {
                      ..._message.author,
                      role: data.messages[0].author.role,
                    }
                  }
                  dispatch(updateMessageInSession({
                    message: _message,
                    parent: parent,
                  }))
                } catch (e) {
                  console.log(e)
                }
              }
            }
            return readChunk()
          } else {
            dispatch(setIsWaitComplete(false))
          }
        });
      };
      await readChunk();
    } catch (e) {
      dispatch(setIsWaitComplete(false))
      console.log(e)
    }
    await mutateConversation();
  }

  const [second, setSecond] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecond((second + 1) % 3);
    }, 1000);
    return () => clearInterval(timer);
  }, [second]);

  const {
    data: dataOfMetadata,
    isLoading: isLoadingOfMetadata,
    mutate: mutateMetadata
  } = useSWR('/api/app/metadata', (url: string) => fetch(url).then((res) => res.json()))

  const paidUseLeft = useMemo(() => {
    if (!dataOfMetadata?.paidUseTTL) {
      dispatch(setPaidUseTTL(0))
      return 0
    }
    dispatch(setPaidUseTTL(dataOfMetadata.paidUseTTL))
    const time = ((dataOfMetadata.paidUseTTL - Date.now() / 1000) / 86400)
    if (time < 0) {
      dispatch(setPaidUseTTL(0))
      return 0
    }
    return time
  }, [dataOfMetadata])

  const freeUseLeft = useMemo(() => {
    if (!dataOfMetadata?.freeUseTTL) {
      dispatch(setFreeUseTTL(0))
      return 0
    }
    dispatch(setFreeUseTTL(dataOfMetadata.freeUseTTL))
    const time = ((dataOfMetadata.freeUseTTL - Date.now() / 1000) / 86400)
    if (time < 0) {
      dispatch(setFreeUseTTL(0))
      return 0
    }
    return time
  }, [dataOfMetadata])

  useEffect(() => {
    if (count >= 10) {
      dispatch(setOffProtected(true))
      setCount(0)
    }
  }, [count, dispatch])

  const getNavigation = () => {
    return (
      <div className={'scrollbar-trigger relative flex h-full w-full flex-1 items-start border-white/20'}>
        <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
          <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors select-none
            duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
             onClick={() => {
               dispatch(clearSession());
               router.push({
                 pathname: `/chat`,
               })
               // @ts-ignore
               window.gtag('event', 'custom_button_click', {
                 'event_category': '按钮',
                 'event_label': '新会话',
               })
             }}
          >
            <AddIcon/>
            新会话
          </a>
          <div className="flex-col flex-1 overflow-y-auto border-white/20">
            <div className="flex flex-col gap-2 text-gray-100 text-sm">
              {
                conversationData && conversationData.length === 0 && isConversationLoading ? (
                  <LoadingIcon/>
                ) : (
                  conversationData && conversationData.items?.map((item: DialogMenuItemProps) => (
                    <DialogMenuItem key={item.id} {...item} callback={mutateConversation}/>
                  ))
                )
              }
            </div>
          </div>
          <div className="border-t border-white/20 pt-2">
            <a
              className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-800 rounded-md">
              <div
                className="flex w-full flex-row justify-between">
                <div className="gold-new-button flex items-center gap-3">
                  <UserIcon/>
                  付费会员卡
                </div>
                <div
                  className="rounded-md bg-yellow-200 px-1.5 py-0.5 text-xs font-medium uppercase text-gray-800">{paidUseLeft.toFixed(0)}天
                </div>
              </div>
            </a>
            {
              user && (
                <Menu as={"div"} className={'group relative'}>
                  <Menu.Button className={'w-full'}>
                    {/*@ts-ignore*/}
                    <a as={"button"}
                       className="flex w-full items-center gap-2.5 rounded-md px-3 py-3 text-sm transition-colors duration-200 hover:bg-gray-800 group-ui-open:bg-gray-800">
                      <div className="-ml-0.5 w-5 flex-shrink-0">
                        <div className="relative flex rounded-sm overflow-hidden">
                          <Image src={user?.picture || ""} alt={user?.name || "avatar"} width={24} height={24}
                                 quality={80}
                                 blurDataURL={`https://dummyimage.com/24x24/ffffff/000000.png&text=${user?.name?.[0] || 'A'}`}
                                 priority/>
                        </div>
                      </div>
                      <div
                        className="grow overflow-hidden pl-3 text-ellipsis whitespace-nowrap text-left text-white">{user?.name}</div>
                      <MoreIcon/>
                    </a>
                  </Menu.Button>
                  <Menu.Items className={'absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-md bg-[#050509] py-1.5 outline-none opacity-100 translate-y-0'}>
                    <div>
                      <Menu.Item>
                        <a href="https://help.openai.com/en/collections/3742473-chatgpt" target="_blank" rel={'noreferrer'}
                           className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700">
                          <ShareIcon/>
                          帮助问答</a>
                      </Menu.Item>
                      <div className="my-1.5 h-px bg-white/20" role="none"></div>
                      <Menu.Item>
                        {/*@ts-ignore*/}
                        <a as={"button"}
                           className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700">
                          <DeleteIcon/>
                          清空记录
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        {/*@ts-ignore*/}
                        <a as={"button"}
                           className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700">
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
                               strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em"
                               xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path
                              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                          设置
                        </a>
                      </Menu.Item>
                      <div className="my-1.5 h-px bg-white/20" role="none"></div>
                      <Menu.Item>
                        {/*@ts-ignore*/}
                        <a as={"button"}
                           className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700">
                          <LogoutIcon/>
                          退出登陆
                        </a>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              )
            }
          </div>
        </nav>
      </div>
    )
  }

  return (
    <>
      <div className={'overflow-hidden w-full h-full relative'}>
        <div className={'dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col'}>
          <div className={'flex h-full min-h-0 flex-col '}>
            {getNavigation()}
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col md:pl-[260px]">
          <div
            className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
            <button type="button" onClick={() => dispatch(setIsOpenSidebar(true))}
                    className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white">
              <span className="sr-only">打开侧边栏</span>
              <MenuIcon/>
            </button>
            <h1 className="flex-1 text-center text-base font-normal">{isWaitHistory ? '...' : session?.title?.slice(0, 10)}</h1>
            <button type="button" className="px-3"
                    onClick={async () => {
                      dispatch(clearSession());
                      router.push({
                        pathname: `/chat`,
                      })
                    }}>
              <AddIcon/>
            </button>
          </div>
          <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
            <DialogBoxList/>
            <div
              className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
              <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
                <div className="relative flex h-full flex-1 md:flex-col">
                  <div
                    className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea tabIndex={0} data-id="root" style={{maxHeight: 200, height: "24px", overflowY: 'hidden'}}
                          disabled={!membershipState}
                          rows={1} ref={inputRef}
                          placeholder={membershipState ? '输入你感兴趣的问题...' : '提示：如果你的试用结束，请获取免费体验卡，或付费会员卡以继续...'}
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              if (e.nativeEvent.isComposing) return;
                              e.preventDefault();
                              await handleSubmit();
                            } else if (e.key === 'Enter' && e.shiftKey) {
                              if (inputRef.current) {
                                // @ts-ignore
                                inputRef.current.style.height = 'auto';
                                // @ts-ignore
                                inputRef.current.style.height = e.target.scrollHeight + 'px';
                              }
                            }
                          }}
                          onChange={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                            dispatch(setInput(e.target.value));
                          }} value={input}
                          className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"></textarea>
                    {
                      membershipState && (
                        <button
                          className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:bottom-0.5 md:disabled:bottom-1"
                          disabled={isWaitComplete}
                          onClick={async (event) => {
                            event.preventDefault();
                            await handleSubmit()
                          }}>
                          {
                            isWaitComplete ? (
                              <div className="text-2xl">
                                <span className={''}>·</span>
                                <span className={`${second % 3 === 1 && 'invisible'}`}>·</span>
                                <span className={`${second % 3 >= 1 && 'invisible'}`}>·</span>
                              </div>
                            ) : (
                              <SendIcon/>
                            )
                          }
                        </button>
                      )
                    }
                  </div>
                </div>
              </form>
              <div
                className="flex justify-center px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6 space-y-1">
                <div className={'flex space-x-1.5'}>
                  <a href={"http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32068202000378"} target={'_blank'} rel={'noreferrer'}>
                    <div className={"flex space-x-1.5"}>
                      <Image src={"/images/beian.png"} width={16} height={16} alt={"备案图标"}/>
                      {/*<p>*/}
                      {/*  苏公网安备32068202000378号*/}
                      {/*</p>*/}
                    </div>
                  </a>
                  <a href={"https://beian.miit.gov.cn"} target={'_blank'} rel={'noreferrer'}>
                    <div className={"flex space-x-1.5"}>
                      <p>
                        沪ICP备2023000778号-2
                      </p>
                    </div>
                  </a>
                  <div>|</div>
                  <div className={'flex space-x-1.5'}>
                    <a href={"/doc/PrivacyPolicy"} target={'_blank'} rel={'noreferrer'}>
                      隐私政策
                    </a>
                  </div>
                  <div>|</div>
                  <div className={"flex space-x-1.5"}>
                    <p>
                      OpenAI 提供技术支持
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Dialog open={isOpenSidebar} onClose={() => setIsOpenSidebar(false)}>
        <Dialog.Panel>
          <div className="relative z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 opacity-100"></div>
            <div className="fixed inset-0 z-40 flex">
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 translate-x-0">
                <div className="absolute top-0 right-0 -mr-12 pt-2 opacity-100">
                  <button type="button" onClick={() => dispatch(setIsOpenSidebar(false))} tabIndex={0}
                          className="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">关闭侧边栏</span>
                    <CloseIcon className={"h-6 w-6 text-white"} strokeWidth={"1.5"}/>
                  </button>
                </div>
                {getNavigation()}
              </div>
              <div className="w-14 flex-shrink-0"></div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Chat;