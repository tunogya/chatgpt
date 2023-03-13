import {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setSession} from "@/store/session";
import DialogBoxItem from "@/components/DialogBoxList/DialogBoxItem";
import {useRouter} from "next/router";
import Placeholder from "@/components/DialogBoxList/PlaceHoder";
import DownIcon from "@/components/SVG/DownIcon";
import ScrollToBottom, {useScrollToBottom, useSticky} from "react-scroll-to-bottom";

const DialogBoxListContent = () => {
  const bottomRef = useRef(null);
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const session = useSelector((state: any) => state.session.session);
  const [isWaitHistory, setIsWaitHistory] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const conversation_id = router.query.id?.[0];
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

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

  console.log(session.mapping)

  // scroll to bottom when new message
  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [session.messages]);

  return (
    <div className={"w-full"}>
      <div className="flex flex-col items-center text-sm dark:bg-gray-800">
        {/*{*/}
        {/*  session?.messages?.length > 0 && ((session?.id && conversation_id) ? session.id?.split('#').pop() === conversation_id : true)*/}
        {/*    ? (*/}
        {/*      <>*/}
        {/*        {*/}
        {/*          session.messages.map((item: any, index: number) => (*/}
        {/*            <DialogBoxItem key={index} {...item} />*/}
        {/*          ))*/}
        {/*        }*/}
        {/*        <div className="w-full h-32 md:h-48 flex-shrink-0"></div>*/}
        {/*      </>*/}
        {/*    ) : (*/}
        {/*      !isWaitHistory && <Placeholder/>*/}
        {/*    )*/}
        {/*}*/}
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

// eslint-disable-next-line react/display-name
export default () => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollToBottom className="h-full dark:bg-gray-800">
        <DialogBoxListContent />
      </ScrollToBottom>
    </div>
  )
}
