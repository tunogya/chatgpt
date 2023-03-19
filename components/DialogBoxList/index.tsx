import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setIsWaitHistory, setSession} from "@/store/session";
import DialogBoxItem from "@/components/DialogBoxList/DialogBoxItem";
import {useRouter} from "next/router";
import Placeholder from "@/components/DialogBoxList/PlaceHoder";
import DownIcon from "@/components/SVG/DownIcon";
import ScrollToBottom, {useScrollToBottom, useSticky} from "react-scroll-to-bottom";

const DialogBoxListContent = () => {
  const bottomRef = useRef(null);
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const session = useSelector((state: any) => state.session.session);
  const isWaitHistory = useSelector((state: any) => state.session.isWaitHistory);
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  // get current conversation history
  const getHistoryMessageOfSession = useCallback(async () => {
    const conversation_id = router.query.id?.[0];
    if (!conversation_id || isWaitHistory) {
      return
    }
    dispatch(setIsWaitHistory(true));
    let res = await fetch(`/api/conversation/${conversation_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    res = await res.json()
    dispatch(setSession({
      // @ts-ignore
      id: res.SK,
      // @ts-ignore
      title: res.title,
      // @ts-ignore
      mapping: res.mapping,
      // @ts-ignore
      create_time: new Date(res.created * 1000).toLocaleString(),
    }))
    dispatch(setIsWaitHistory(false));
  }, [router])

  useEffect(() => {
    getHistoryMessageOfSession()
  }, [getHistoryMessageOfSession])

  // scroll to bottom when new message
  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [session.messages]);

  const rootMessageId = useMemo(() => {
    // return null
    // 遍历session.mapping，找到parent为null的节点
    if (!session?.mapping) {
      return null
    }
    const ids = Object?.keys(session.mapping) || []
    if (ids.length === 0) {
      return null
    }
    let check_point = ids[0]
    while (session.mapping[check_point].parent !== null) {
      check_point = session.mapping[check_point].parent
    }
    return check_point
  }, [session.mapping])

  return (
    <div className={"w-full"}>
      <div className="flex flex-col items-center text-sm dark:bg-gray-800">
        {
          // if isWaitHistory is true, show null
          isWaitHistory ? (
            <></>
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
                <Placeholder/>
              )
          )
        }
      </div>
      {
        !sticky && (
          <button onClick={scrollToBottom}
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
      <ScrollToBottom className="h-full dark:bg-gray-800">
        <DialogBoxListContent/>
      </ScrollToBottom>
    </div>
  )
}

export default WrapDialogBoxListContent
