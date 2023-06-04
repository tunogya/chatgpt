import ConversationIcon from "@/components/SVG/ConversationIcon";
import {FC, useMemo, useState} from "react";
import RightIcon from "@/components/SVG/RightIcon";
import CloseIcon from "@/components/SVG/CloseIcon";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {clearSession, setIsOpenShare} from "@/store/session";
import DeleteIcon from "@/components/SVG/DeleteIcon";
import EditIcon from "@/components/SVG/EditIcon";
import ShareIcon from "@/components/SVG/ShareIcon";

export type DialogMenuItemProps = {
  id: string,
  title: string,
  create_time: string,
  callback?: () => void,
}

const DialogMenuItem: FC<DialogMenuItemProps> = ({...props}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [updateConfirm, setUpdateConfirm] = useState(false);
  const [title, setTitle] = useState(props.title);
  const router = useRouter();
  const dispatch = useDispatch();

  const deleteConversationByIdItem = async () => {
    try {
      await fetch(`/api/conversation/${props.id.split('#').pop()}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      props.callback?.()
      if (router.query.id?.[0] === props.id.split('#').pop()) {
        dispatch(clearSession());
        router.push({
          pathname: `/chat`,
        })
      }
    } catch (e) {
      console.log(e)
    }
    // @ts-ignore
    window.gtag('event', 'custom_button_click', {
      'event_category': '按钮',
      'event_label': '删除会话',
    })
  }

  const updateConversationItemTitle = async () => {
    if (!title) {
      return
    }
    try {
      await fetch(`/api/conversation/${props.id.split('#').pop()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
        })
      })
      props.callback?.()
      setUpdateConfirm(false)
    } catch (e) {
      console.log(e)
    }
    // @ts-ignore
    window.gtag('event', 'custom_button_click', {
      'event_category': '按钮',
      'event_label': '编辑会话标题',
    })
  }

  const isSelected = useMemo(() => {
    return props.id.split('#').pop() === router.query.id?.[0];
  }, [props.id, router.query.id])

  return (
    <a
      className={`flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all ${isSelected ? "pr-14 bg-gray-800 hover:bg-gray-800" : "hover:bg-[#2A2B32] hover:pr-4 group"}`}
      onClick={() => {
        router.push({
          pathname: `/chat/${props.id.split('#').pop()}`,
        })
        // @ts-ignore
        window.gtag('event', 'custom_button_click', {
          'event_category': '按钮',
          'event_label': '切换会话',
        })
      }}
    >
      {
        deleteConfirm ? <DeleteIcon/> : <ConversationIcon/>
      }
      <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
        {
          updateConfirm ? (
            <input type="text" className="text-sm border-none bg-transparent p-0 m-0 w-full mr-0"
                   value={title} onChange={(e) => setTitle(e.target.value)}/>
          ) : (
            <>
              {title}
              <div
                className={`absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l ${isSelected ? "from-gray-800" : "from-gray-900 group-hover:from-[#2A2B32]"}`}></div>
            </>
          )
        }
      </div>
      {
        isSelected && (
          <>
            {
              deleteConfirm && (
                <div className="absolute flex right-1 z-10 text-gray-300 visible">
                  <button className="p-1 hover:text-white" onClick={deleteConversationByIdItem}>
                    <RightIcon/>
                  </button>
                  <button className="p-1 hover:text-white" onClick={() => setDeleteConfirm(false)}>
                    <CloseIcon/>
                  </button>
                </div>
              )
            }
            {
              updateConfirm && (
                <div className="absolute flex right-1 z-10 text-gray-300 visible">
                  <button className="p-1 hover:text-white" onClick={updateConversationItemTitle}>
                    <RightIcon/>
                  </button>
                  <button className="p-1 hover:text-white" onClick={() => setUpdateConfirm(false)}>
                    <CloseIcon/>
                  </button>
                </div>
              )
            }
            {
              !deleteConfirm && !updateConfirm && (
                <div className="absolute flex right-1 z-10 text-gray-300 visible">
                  <button className="p-1 hover:text-white" onClick={() => setUpdateConfirm(true)}>
                    <EditIcon/>
                  </button>
                  <button className="p-1 hover:text-white" onClick={() => dispatch(setIsOpenShare(true))}>
                    <ShareIcon/>
                  </button>
                  <button className="p-1 hover:text-white" onClick={() => setDeleteConfirm(true)}>
                    <DeleteIcon/>
                  </button>
                </div>
              )
            }
          </>
        )
      }
    </a>
  )
}

export default DialogMenuItem
