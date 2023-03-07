import AddIcon from "@/components/SVG/AddIcon";
import LogoutIcon from "@/components/SVG/LogoutIcon";
import SunIcon from "@/components/SVG/SunIcon";
import DeleteIcon from "@/components/SVG/DeleteIcon";
import ConversationsList from "@/components/ConversationsList";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {logout} from "@/store/user";
import {clearSession, setConversation} from "@/store/session";
import RightIcon from "@/components/SVG/RightIcon";

const NavigationBar = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const conversation = useSelector((state: any) => state.session.conversation);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [colorMode, setColorMode] = useState('light');

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
  }

  const clearConversationList = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return
    }
    const response = await fetch('/api/conversation', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ids: conversation.map((c: any) => c.id),
        })
      }
    );
    if (!response.ok) {
      return
    }
    await getConversationHistory()
    dispatch(clearSession())
    setDeleteConfirm(false);
    await router.push({
      pathname: `/chat`,
    })
  }

  const getConversationHistory = async () => {
    const response = await fetch('/api/conversation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    dispatch(setConversation(data.items || []));
  }

  return (
    <div className={'scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20'}>
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors
            duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
           onClick={async () => {
             await dispatch(clearSession());
             await router.push({
               pathname: `/chat`,
             })
           }}
        >
          <AddIcon/>
          新会话
        </a>
        <ConversationsList/>
        {
          conversation && conversation.length > 0 && (
            <a
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors
              duration-200 text-white cursor-pointer text-sm"
              onClick={clearConversationList}
            >
              {deleteConfirm ? <RightIcon/> : <DeleteIcon/>}
              {deleteConfirm ? '确认清空（最多25条）' : '清空会话'}
            </a>
          )
        }
        <a
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors
              duration-200 text-white cursor-pointer text-sm" onClick={toggleColorMode}
        >
          <SunIcon/>
          {colorMode === 'light' ? '深色' : '浅色'}模式
        </a>
        <a
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors
              duration-200 text-white cursor-pointer text-sm"
          onClick={async () => {
            await dispatch(logout())
            await router.push('/auth/login')
          }}
        >
          <LogoutIcon/>
          退出登陆
        </a>
      </nav>
    </div>
  )
}

export default NavigationBar