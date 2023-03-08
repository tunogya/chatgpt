import {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setSession} from "@/store/session";
import DialogBoxItem from "@/components/DialogBoxList/DialogBoxItem";
import {useRouter} from "next/router";
import Placeholder from "@/components/DialogBoxList/PlaceHoder";

const DialogBoxList = () => {
  const bottomRef = useRef(null);
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const session = useSelector((state: any) => state.session.session);
  const [isWaitHistory, setIsWaitHistory] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const conversation_id = router.query.id?.[0];

  // get current conversation history
  const getHistoryMessageOfSession = useCallback(async () => {
    if (!conversation_id || isWaitHistory) {
      return
    }
    setIsWaitHistory(true);
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
      messages: res.messages,
    }))
    setIsWaitHistory(false);
  }, [conversation_id])

  useEffect(() => {
    getHistoryMessageOfSession()
  }, [getHistoryMessageOfSession])

  // scroll to bottom when new message
  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [session.messages]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="react-scroll-to-bottom--css-izfbq-79elbk h-full dark:bg-gray-800">
        <div className="react-scroll-to-bottom--css-izfbq-1n7m0yu">
          <div className="flex flex-col items-center text-sm dark:bg-gray-800">
            {
              session?.messages?.length > 0 && ((session?.id && conversation_id) ? session.id?.split('#').pop() === conversation_id : true)
                ? session.messages.map((item: any, index: number) => (
                  <DialogBoxItem key={index} {...item} />
                )) : (
                  <Placeholder/>
                )
            }
            <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DialogBoxList
