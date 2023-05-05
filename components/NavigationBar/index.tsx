import AddIcon from "@/components/SVG/AddIcon";
import LogoutIcon from "@/components/SVG/LogoutIcon";
import SunIcon from "@/components/SVG/SunIcon";
import DeleteIcon from "@/components/SVG/DeleteIcon";
import DialogMenuList from "@/components/DialogMenuList";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {clearSession, setConversation} from "@/store/session";
import RightIcon from "@/components/SVG/RightIcon";
import MoonIcon from "@/components/SVG/MoonIcon";
import {setOffProtected} from "@/store/ui";

const NavigationBar = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const conversation = useSelector((state: any) => state.session.conversation);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [colorMode, setColorMode] = useState('light');
  const [count, setCount] = useState(0);

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
    <div className={'scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20'}>
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
        {
          conversation && conversation.length > 0 && (
            <a
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors select-none
              duration-200 text-white cursor-pointer text-sm"
              onClick={() => {
                clearConversationList()
                // @ts-ignore
                window.gtag('event', 'custom_button_click', {
                  'event_category': '按钮',
                  'event_label': '清空会话',
                  'value': deleteConfirm ? '确认清空' : '清空会话'
                })
              }}
            >
              {deleteConfirm ? <RightIcon/> : <DeleteIcon/>}
              {deleteConfirm ? '确认清空（最多25条）' : '清空会话'}
            </a>
          )
        }
        <a
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors select-none
              duration-200 text-white cursor-pointer text-sm" onClick={() => {
          toggleColorMode()
          // @ts-ignore
          window.gtag('event', 'custom_button_click', {
            'event_category': '按钮',
            'event_label': '切换显示模式',
            'value': colorMode === 'light' ? '深色' : '浅色',
          })
        }}
        >
          {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
          {colorMode === 'light' ? '深色' : '浅色'}模式
        </a>
        <a
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors select-none
              duration-200 text-white cursor-pointer text-sm"
          href={"https://support.qq.com/products/566478"} target={"_blank"} rel={"noreferrer"}
        >
          <AddIcon/>
          创建工单
        </a>
        <a
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors select-none
              duration-200 text-white cursor-pointer text-sm"
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
      </nav>
    </div>
  )
}

export default NavigationBar