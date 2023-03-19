import DialogMenuItem, {ConversationItemProps} from "./DialogMenuItem";
import {setConversation} from "@/store/session";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import LoadingIcon from "@/components/SVG/LoadingIcon";

const DialogMenuList = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const session = useSelector((state: any) => state.session.session);
  const conversation = useSelector((state: any) => state.session.conversation);
  const [isWaiting, setIsWaiting] = useState(false);

  const getConversationHistory = async () => {
    setIsWaiting(true)
    const response = await fetch('/api/conversation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    dispatch(setConversation(data.items || []));
    setIsWaiting(false);
  }

  useEffect(() => {
    getConversationHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id])

  return (
    <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
      <div className="flex flex-col gap-2 text-gray-100 text-sm">
        {
          conversation.length === 0 && isWaiting ? (
            <LoadingIcon/>
          ) : (
            conversation && conversation?.map((item: ConversationItemProps) => (
              <DialogMenuItem key={item.id} {...item}/>
            ))
          )
        }
      </div>
    </div>
  )
}

export default DialogMenuList