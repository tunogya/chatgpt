import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {setArea, setTheme} from "@/store/ui";
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
import {Dialog, Menu, Tab} from "@headlessui/react";
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
import RightIcon from "@/components/SVG/RightIcon";
import SettingIcon from "@/components/SVG/SettingIcon";
import DataIcon from "@/components/SVG/DataIcon";
import OptionIcon from "@/components/SVG/OptionIcon";
import StopIcon from "@/components/SVG/StopIcon";
import AbandonIcon from "@/components/SVG/AbandonIcon";
// import ReIcon from "@/components/SVG/ReIcon";

const Chat = ({user}: any) => {
  const dispatch = useDispatch();
  const router = useRouter()
  const isWaitComplete = useSelector((state: any) => state.session.isWaitComplete);
  const lastMessageId = useSelector((state: any) => state.session.lastMessageId)
  const isBlockComplete = useSelector((state: any) => state.session.isBlockComplete);
  const session = useSelector((state: any) => state.session.session);
  const theme = useSelector((state: any) => state.ui.theme);
  const area = useSelector((state: any) => state.ui.area);
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [copied, setCopied] = useState<boolean>(false);
  const controllerRef = useRef(null);

  const {
    data: conversationData,
    isLoading: isConversationLoading,
    mutate: mutateConversation
  } = useSWR('/api/conversation', (url: string) => fetch(url).then((res) => res.json()))

  const handleSubmit = async () => {
    if (input === '' || isWaitComplete || isBlockComplete) return;
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
    setInput('')
    // @ts-ignore
    if (inputRef.current) inputRef.current.style.height = 'auto';
    await complete(message, message_id);
  }

  const complete = async (message: Message, parent: string) => {
    const controller = new AbortController();
    // @ts-ignore
    controllerRef.current = controller;
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
          off_protected: false,
          conversation_id: session.id,
          action: 'next',
          model: 'gpt-3.5-turbo',
          messages: [message],
          parent_message_id: lastMessageId,
        }),
        signal: controller.signal,
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
      controller.abort();
      console.log(e)
    }
    await mutateConversation();
  }

  const [second, setSecond] = useState(0);

  useEffect(() => {
    if (isWaitComplete && isBlockComplete && controllerRef) {
      // @ts-ignore
      controllerRef?.current?.abort();
    }
  }, [isBlockComplete, isWaitComplete, controllerRef])

  useEffect(() => {
    const timer = setInterval(() => {
      setSecond((second + 1) % 3);
    }, 1000);
    return () => clearInterval(timer);
  }, [second]);

  const {
    data: dataOfMetadata,
  } = useSWR('/api/app/metadata', (url: string) => fetch(url).then((res) => res.json()))

  const paidUseLeft = useMemo(() => {
    if (!dataOfMetadata?.paidUseTTL) {
      return 0
    }
    const time = ((dataOfMetadata.paidUseTTL - Date.now() / 1000) / 86400)
    if (time < 0) {
      return 0
    }
    return time
  }, [dataOfMetadata?.paidUseTTL])

  const clearConversationList = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return
    }
    if (conversationData.items.length > 0) {
      await fetch('/api/conversation', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ids: conversationData.items.map((c: any) => c.id),
          })
        }
      );
    }
    setDeleteConfirm(false);
    dispatch(clearSession())
    await router.push({
      pathname: `/chat`,
    })
    await mutateConversation();
  }

  const getNavigation = () => {
    return (
      <div className={'scrollbar-trigger relative flex h-full w-full flex-1 items-start border-white/20'}>
        <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
          <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors select-none
            duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
             onClick={async () => {
               dispatch(clearSession());
               await router.push({
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
              className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-800 rounded-md"
              onClick={() => {
                setIsOpenPayment(true)
                // @ts-ignore
                window.gtag('event', 'custom_button_click', {
                  'event_category': '按钮',
                  'event_label': '会员菜单',
                })
              }}
            >
              <div
                className="flex w-full flex-row justify-between select-none">
                <div className="gold-new-button flex items-center gap-3">
                  <UserIcon/>
                  付费会员卡
                </div>
                <div
                  className="rounded-md bg-yellow-200 px-1.5 py-0.5 text-xs font-medium uppercase text-gray-800">
                  {paidUseLeft > 0 ? `${Math.ceil(paidUseLeft)}天` : `每月19元起`}
                </div>
              </div>
            </a>
            {
              user && (
                <Menu as={"div"} className={'group relative'}>
                  <Menu.Button className={'w-full'}>
                    <a
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
                        className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-white">{user?.name}</div>
                      <MoreIcon/>
                    </a>
                  </Menu.Button>
                  <Menu.Items
                    className={'absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-md bg-[#050509] py-1.5 outline-none opacity-100 translate-y-0'}>
                    <div>
                      <Menu.Item>
                        <a href="https://support.qq.com/products/566478" target="_blank" rel={'noreferrer'}
                           className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700">
                          <ShareIcon/>
                          帮助和反馈
                        </a>
                      </Menu.Item>
                      <div className="my-1.5 h-px bg-white/20" role="none"></div>
                      {
                        conversationData && conversationData.items.length > 0 && (
                          <Menu.Item>
                            <a
                              className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700"
                              onClick={async (e) => {
                                e.preventDefault()
                                await clearConversationList()
                                // @ts-ignore
                                window.gtag('event', 'custom_button_click', {
                                  'event_category': '按钮',
                                  'event_label': '清空会话',
                                  'value': deleteConfirm ? '确认清空' : '清空会话'
                                })
                              }}
                            >
                              {deleteConfirm ? <RightIcon/> : <DeleteIcon/>}
                              {deleteConfirm ? '确认清空' : '清空会话'}
                            </a>
                          </Menu.Item>
                        )
                      }
                      <Menu.Item>
                        <a
                          className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700"
                          onClick={() => setIsOpenSetting(true)}
                        >
                          <SettingIcon/>
                          系统设置
                        </a>
                      </Menu.Item>
                      <div className="my-1.5 h-px bg-white/20" role="none"></div>
                      <Menu.Item>
                        <a
                          className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700"
                          onClick={async () => {
                            dispatch(clearSession());
                            // @ts-ignore
                            window.gtag('event', 'custom_button_click', {
                              'event_category': '按钮',
                              'event_label': '退出登陆',
                            })
                          }}
                          href={'/api/auth/logout'}
                        >
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
      <div className={'overflow-hidden w-full h-full relative flex z-0'}>
        <div className={'dark flex-shrink-0 overflow-x-hidden bg-gray-900 hidden md:inline-block'}
             style={{width: "260px"}}>
          <div className={'flex h-full min-h-0 flex-col'}>
            {getNavigation()}
          </div>
        </div>
        <div className="flex h-full max-w-full flex-1 flex-col overflow-hidden">
          <div
            className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
            <button type="button" onClick={() => setIsOpenSidebar(true)}
                    className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white">
              <div className="sr-only">打开侧边栏</div>
              <MenuIcon/>
            </button>
            <h1
              className="flex-1 text-center text-base font-normal"></h1>
            <button type="button" className="px-3"
                    onClick={async () => {
                      dispatch(clearSession());
                      await router.push({
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
              <form
                className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
                <div className="relative flex h-full flex-1 md:flex-col">
                  <div className="flex ml-1 mt-1.5 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                    {/*{*/}
                    {/*  session.messages.length >= 2 && (*/}
                    {/*    <button className="btn relative btn-neutral border-0 md:border" onClick={() => {*/}
                    {/*      // dispatch(setIsShowRegenerate(false))*/}
                    {/*    }}>*/}
                    {/*      <div className="flex w-full items-center justify-center gap-2">*/}
                    {/*        <ReIcon/>*/}
                    {/*        重新生成对话*/}
                    {/*      </div>*/}
                    {/*    </button>*/}
                    {/*  )*/}
                    {/*}*/}
                    {isWaitComplete && (
                      <button className="btn relative btn-neutral border-0 md:border rounded-md" onClick={() => {
                        if (isWaitComplete && controllerRef) {
                          // @ts-ignore
                          controllerRef?.current?.abort()
                        }
                      }}>
                        <div className="flex w-full items-center justify-center gap-2">
                          <StopIcon/>
                          停止对话
                        </div>
                      </button>
                    )}
                  </div>
                  <div
                    className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea tabIndex={0} data-id="root" style={{maxHeight: 200, height: "24px", overflowY: 'hidden'}}
                          disabled={!paidUseLeft}
                          rows={1} ref={inputRef}
                          placeholder={paidUseLeft > 0 ? 'Message' : '如您试用结束，请获取会员卡以继续'}
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
                            setInput(e.target.value)
                          }} value={input}
                          className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"></textarea>
                    {
                      paidUseLeft > 0 && (
                        <button
                          className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:bottom-0.5 md:disabled:bottom-1"
                          disabled={isWaitComplete || isBlockComplete}
                          onClick={async (event) => {
                            event.preventDefault();
                            await handleSubmit()
                          }}>
                          {
                            isWaitComplete ? (
                              <div className="flex text-2xl">
                                <div className={''}>·</div>
                                <div className={`${second % 3 === 1 && 'invisible'}`}>·</div>
                                <div className={`${second % 3 >= 1 && 'invisible'}`}>·</div>
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
                className="flex justify-center px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-gray-500 md:px-4 md:pt-3 md:pb-6 space-y-1">
                <div className={'flex space-x-1.5'}>
                  <div className={"flex space-x-1.5"}>
                    <p>
                      © {new Date().getFullYear() }, Abandon Inc.
                    </p>
                  </div>
                  <div className={"flex space-x-1.5"}>
                    由 OpenAI 提供技术支持。
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Dialog open={isOpenSidebar} onClose={() => setIsOpenSidebar(false)}>
        <div className="relative z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 opacity-100"></div>
          <div className="fixed inset-0 z-40 flex">
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 translate-x-0">
              <div className="absolute top-0 right-0 -mr-12 pt-2 opacity-100">
                <button type="button" onClick={() => setIsOpenSidebar(false)} tabIndex={0}
                        className="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <div className="sr-only">关闭侧边栏</div>
                  <CloseIcon className={"h-6 w-6 text-white"} strokeWidth={"1.5"}/>
                </button>
              </div>
              {getNavigation()}
              <div className="w-14 flex-shrink-0"></div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      <Dialog open={isOpenSetting} onClose={() => setIsOpenSetting(false)}>
        <div className="relative z-50">
          <div className="fixed inset-0 bg-gray-500/90 transition-opacity dark:bg-gray-800/90" aria-hidden="true"></div>
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Dialog.Panel
                className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:max-w-2xl">
                <div
                  className="flex items-center justify-between border-b-[1px] border-black/10 dark:border-white/10 px-4 pb-4 pt-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="text-center sm:text-left">
                      <h3
                        className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">系统设置
                      </h3>
                    </div>
                  </div>
                  <div>
                    <div className="sm:mt-0">
                      <button className="inline-block text-gray-500 hover:text-gray-700"
                              onClick={() => setIsOpenSetting(false)}>
                        <CloseIcon className={"text-gray-900 dark:text-gray-200 h-5 w-5"}/>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 sm:pt-4">
                  <div dir="ltr" data-orientation="vertical" className="flex flex-col gap-6 md:flex-row">
                    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                      <Tab.List className="-ml-[8px] flex min-w-[180px] flex-shrink-0 flex-row md:flex-col">
                        <Tab as={"button"}
                             className={`${selectedIndex === 0 ? 'bg-gray-800 text-white' : ''} dark:text-white flex flex-1 md:flex-grow-0 justify-center md:justify-start items-center  gap-2 rounded-md px-2 py-1.5 text-sm`}>
                          <SettingIcon/>
                          <div>常规</div>
                        </Tab>
                        <Tab as={"button"}
                             className={`${selectedIndex === 1 ? 'bg-gray-800 text-white' : ''} dark:text-white flex flex-1 md:flex-grow-0 justify-center md:justify-start items-center gap-2 rounded-md px-2 py-1.5 text-sm`}>
                          <DataIcon/>
                          <div>数据</div>
                        </Tab>
                        <Tab as={"button"}
                             className={`${selectedIndex === 2 ? 'bg-gray-800 text-white' : ''} dark:text-white flex flex-1 md:flex-grow-0 justify-center md:justify-start items-center gap-2 rounded-md px-2 py-1.5 text-sm`}>
                          <UserIcon/>
                          <div>账户</div>
                        </Tab>
                      </Tab.List>
                      <Tab.Panels className="w-full md:min-h-[300px]">
                        <Tab.Panel>
                          <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <div className="border-b-[1px] pb-3 last-of-type:border-b-0 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div>主题</div>
                                <select
                                  className="rounded border border-black/10 bg-transparent text-sm dark:border-white/20"
                                  value={theme}
                                  onChange={(e) => {
                                    dispatch(setTheme(e.target.value))
                                    //   @ts-ignore
                                    window.gtag('event', 'custom_button_click', {
                                      'event_category': '按钮',
                                      'event_label': '主题',
                                      'value': e.target.value
                                    })
                                  }}
                                >
                                  <option value="system">跟随系统</option>
                                  <option value="dark">暗黑模式</option>
                                  <option value="light">浅色模式</option>
                                </select></div>
                            </div>
                            <div className="border-b-[1px] pb-3 last-of-type:border-b-0 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div>区域和限制</div>
                                <select
                                  className="rounded border border-black/10 bg-transparent text-sm dark:border-white/20"
                                  value={area}
                                  onChange={(e) => {
                                    dispatch(setArea(e.target.value))
                                    //   @ts-ignore
                                    window.gtag('event', 'custom_button_click', {
                                      'event_category': '按钮',
                                      'event_label': '区域和限制',
                                      'value': e.target.value
                                    })
                                  }}
                                >
                                  <option value="global">全球地区</option>
                                  <option value="china">中国地区</option>
                                </select>
                              </div>
                              {
                                area === 'china' ? (
                                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-600">
                                    如果您在中国大陆地区使用本应用，您需要遵守中国大陆地区的法律法规。
                                  </div>
                                ) : (
                                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-600">
                                    请遵循您所在地区的法律法规。
                                  </div>
                                )
                              }
                            </div>
                            <div className="border-b-[1px] pb-3 last-of-type:border-b-0 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div>清空所有记录</div>
                                <button className="btn relative btn-danger"
                                        disabled={conversationData?.items.length === 0}
                                        onClick={async () => {
                                          await clearConversationList()
                                          // @ts-ignore
                                          window.gtag('event', 'custom_button_click', {
                                            'event_category': '按钮',
                                            'event_label': '清空会话',
                                            'value': deleteConfirm ? '确认清空' : '清空会话'
                                          })
                                        }}>
                                  <div className="flex w-full gap-2 items-center justify-center">
                                    {deleteConfirm ? '确认清空' : '清空会话'}
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </Tab.Panel>
                        <Tab.Panel>
                          <div className="w-full md:min-h-[300px]">
                            <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <div className="border-b-[1px] pb-3 last-of-type:border-b-0 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                  <div>聊天记录</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-600">
                                  我们将为您云同步聊天记录，以便您在任何设备上使用。
                                  <a
                                    href="/doc/privacy" target="_blank"
                                    className="underline" rel="noreferrer">隐私政策</a>
                                </div>
                              </div>
                              <div className="border-b-[1px] pb-3 last-of-type:border-b-0 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                  <div>导出数据</div>
                                  <button className="btn relative btn-neutral"
                                    // disabled={conversationData?.items.length === 0}
                                          disabled={true}
                                  >
                                    <div className="flex w-full gap-2 items-center justify-center">导出</div>
                                  </button>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-600">
                                  为了保护您的隐私，聊天记录默认在创建后的365天后自动删除。<br/>
                                  我们将尽快提供导出功能供您安全的本地存储。
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Panel>
                        <Tab.Panel>
                          <div className="w-full md:min-h-[300px]">
                            <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <div className="border-b-[1px] pb-3 last-of-type:border-b-0 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                  <div>删除账户</div>
                                  <button className="btn relative btn-danger" disabled={true}>
                                    <div className="flex w-full gap-2 items-center justify-center">删除</div>
                                  </button>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-600">
                                  该功能即将上线
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog open={isOpenPayment} onClose={() => setIsOpenPayment(false)}>
        <div className="relative z-50">
          <div className="fixed inset-0 bg-gray-500/90 transition-opacity dark:bg-gray-800/90 opacity-100"
               aria-hidden="true"></div>
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 !p-0">
              <div
                className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 !my-0 flex min-h-screen flex-col items-center justify-center !rounded-none !py-0 bg-transparent dark:bg-transparent opacity-100 translate-y-0 sm:scale-100">
                <div
                  className="flex items-center justify-between border-b-[1px] border-black/10 dark:border-white/10 px-4 pb-4 pt-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="text-center sm:text-left">
                      <div className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 sm:pt-4">
                  <div className="flex h-full flex-col items-center justify-start">
                    <div className="relative">
                      <div
                        className="grow justify-center bg-white dark:bg-gray-900 dark:text-white rounded-md flex flex-col items-start overflow-hidden border shadow-md dark:border-gray-700">
                        <div
                          className="flex w-full flex-row items-center justify-between border-b px-4 py-3 text-gray-700 dark:text-gray-100 dark:border-gray-700">
                          <AbandonIcon width={'100'}/>
                          <button className="text-gray-700 opacity-50 transition hover:opacity-75 dark:text-white"
                                  onClick={() => setIsOpenPayment(false)}>
                            <CloseIcon/>
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2">
                          <div
                            className="relative order-2 col-div-1 border-r-0 border-t dark:border-gray-700 sm:order-1 sm:border-r sm:border-t-0">
                            <div className="p-4 flex flex-col gap-3 bg-white z-20 relative dark:bg-gray-900">
                              <div className="text-xl font-semibold justify-between items-center flex">
                                <div className={"text-gray-800 dark:text-gray-200"}>ChatGPT</div>
                              </div>
                              <button
                                className="btn relative btn-primary dark:text-gray-white border-none bg-gray-300 py-3 hover:opacity-80 dark:hover:text-white font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:opacity-100"
                                onClick={() => {
                                  window.open('https://chat.openai.com', '_blank')
                                }}
                              >
                                <div className="flex w-full gap-2 items-center justify-center">
                                  <div className="inline-block">
                                    chat.openai.com
                                  </div>
                                </div>
                              </button>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs">
                                <OptionIcon className={"h-5 w-5 text-gray-400"}/>
                                <div>免费研究预览版，仅特定的国家和地区使用</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs">
                                <OptionIcon className={"h-5 w-5 text-gray-400"}/>
                                <div>在其他国家和地区使用，可能会被封号</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs">
                                <OptionIcon className={"h-5 w-5 text-gray-400"}/>
                                <div>开启聊天记录时，会采集聊天内容用于训练和改进</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs">
                                <OptionIcon className={"h-5 w-5 text-gray-400"}/>
                                <div>禁用聊天记录后，保留最多 30 天的对话记录</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs sm:pb-2">
                                <OptionIcon className={"h-5 w-5 text-gray-400"}/>
                                <div>有昂贵的 PLUS 订阅</div>
                              </div>
                            </div>
                          </div>
                          <div className="relative order-1 col-div-1 sm:order-2">
                            <div className="p-4 flex flex-col gap-3 bg-white z-20 relative dark:bg-gray-900">
                              <div className="text-xl font-semibold justify-between items-center flex">
                                <div>Abandon Chat</div>
                                <div
                                  className="font-semibold text-gray-500">每月19元起
                                </div>
                              </div>
                              <button className="btn relative btn-primary border-none py-3 font-semibold"
                                      onClick={async () => {
                                        const out_trade_no = uuidv4()
                                        await router.push(`/pay/${out_trade_no}`)
                                      }}
                              >
                                <div className="flex w-full gap-2 items-center justify-center">
                                  <div
                                    className="inline-block text-white">订阅会员
                                  </div>
                                </div>
                              </button>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs">
                                <OptionIcon className={"h-5 w-5 text-green-700"}/>
                                <div>没有任何地域限制，企业级的账户安全和可靠</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs">
                                <OptionIcon className={"h-5 w-5 text-green-700"}/>
                                <div>ChatGPT Business 级别的 API 数据使用政策</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs">
                                <OptionIcon className={"h-5 w-5 text-green-700"}/>
                                <div>最多保留 365 天的对话记录，可永久删除保证隐私安全</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs">
                                <OptionIcon className={"h-5 w-5 text-green-700"}/>
                                <div>媲美原版，且不断更新提高用户体验</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs sm:pb-2">
                                <OptionIcon className={"h-5 w-5 text-green-700"}/>
                                <div>拥有我们一流工程师团队的直接支持</div>
                              </div>
                              <div className="gap-2 flex flex-row justify-start items-center text-xs sm:pb-1">
                                <button onClick={() => {
                                  router.push('/redeem')
                                }} className="flex flex-row items-center space-x-1 underline">
                                  <div>CDKEY 兑换中心</div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Chat;