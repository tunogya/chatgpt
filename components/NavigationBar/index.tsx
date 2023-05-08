import AddIcon from "@/components/SVG/AddIcon";
import DialogMenuList from "@/components/DialogMenuList";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import {clearSession, setConversation} from "@/store/session";
import {setFreeUseTTL, setOffProtected, setPaidUseTTL} from "@/store/ui";
import MoreIcon from "@/components/SVG/MoreIcon";
import UserIcon from "@/components/SVG/UserIcon";
import {useUser} from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import useSWR from "swr";
import LogoutIcon from "@/components/SVG/LogoutIcon";
import DeleteIcon from "@/components/SVG/DeleteIcon";
import ShareIcon from "@/components/SVG/ShareIcon";
import {Menu} from '@headlessui/react'

const NavigationBar = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const conversation = useSelector((state: any) => state.session.conversation);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [colorMode, setColorMode] = useState('light');
  const [count, setCount] = useState(0);
  const {user} = useUser();

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

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setColorMode('dark')
      document.documentElement.classList.add('dark')
    } else {
      setColorMode('light')
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleColorMode = () => {
    if (colorMode === 'light') {
      setColorMode('dark')
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      setColorMode('light')
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
    setCount(count + 1);
  }

  const clearConversationList = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return
    }
    await fetch('/api/conversation', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: conversation.map((c: any) => c.id),
        })
      }
    );
    setDeleteConfirm(false);
    dispatch(clearSession())
    await getConversationHistory()
    await router.push({
      pathname: `/chat`,
    })
  }

  const getConversationHistory = async () => {
    const response = await fetch('/api/conversation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    dispatch(setConversation(data.items || []));
  }

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
        <DialogMenuList/>
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
                  <button
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
                  </button>
                </Menu.Button>
                <Menu.Items className={'absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-md bg-[#050509] py-1.5 outline-none opacity-100 translate-y-0'}>
                  <div>
                    <Menu.Item>
                      <a href="https://help.openai.com/en/collections/3742473-chatgpt" target="_blank" rel={'noreferrer'}
                         className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700"
                         id="headlessui-menu-item-:r2q:" role="menuitem" tabIndex={-1}
                         data-headlessui-state="">
                        <ShareIcon/>
                        帮助问答</a>
                    </Menu.Item>
                    <div className="my-1.5 h-px bg-white/20" role="none"></div>
                    <Menu.Item disabled>
                      <button
                        className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700"
                        id="headlessui-menu-item-:r2r:" role="menuitem" tabIndex={-1} data-headlessui-state="">
                        <DeleteIcon/>
                        清空记录
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700"
                        id="headlessui-menu-item-:r2s:" role="menuitem" tabIndex={-1}
                        data-headlessui-state="">
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
                             strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em"
                             xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        设置
                      </button>
                    </Menu.Item>
                    <div className="my-1.5 h-px bg-white/20" role="none"></div>
                    <Menu.Item>
                      <button
                        className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700"
                        id="headlessui-menu-item-:r2t:" role="menuitem" tabIndex={-1} data-headlessui-state="">
                        <LogoutIcon/>
                        退出登陆
                      </button>
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

export default NavigationBar